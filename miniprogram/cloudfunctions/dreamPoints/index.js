// 梦想分计算云函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 计算连续打卡奖励
function calculateCheckinReward(checkinDays) {
  if (checkinDays >= 30) return 100 // 连续30天奖励100分
  if (checkinDays >= 7) return 30   // 连续7天奖励30分
  if (checkinDays >= 3) return 10   // 连续3天奖励10分
  return 0
}

// 计算里程碑奖励
function calculateMilestoneReward(progress) {
  if (progress >= 100) return 500  // 完成梦想奖励500分
  if (progress >= 50) return 100   // 完成50%奖励100分
  if (progress >= 25) return 50    // 完成25%奖励50分
  return 0
}

// 主函数
exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'calculateDailyPoints':
        // 计算每日可获得的梦想分
        const user = await db.collection('users').where({ _openid: data.openid }).get()
        if (user.data.length === 0) return { points: 0 }
        
        const userData = user.data[0]
        let totalPoints = 0
        
        // 基础分：节省金额
        totalPoints += data.savedAmount || 0
        
        // 连续打卡奖励
        const checkinReward = calculateCheckinReward(userData.checkinDays)
        totalPoints += checkinReward
        
        // 梦想进度奖励
        const dreams = await db.collection('dreams').where({ 
          userOpenid: data.openid,
          status: 'active'
        }).get()
        
        for (const dream of dreams.data) {
          const milestoneReward = calculateMilestoneReward(dream.progress)
          totalPoints += milestoneReward
        }
        
        return { points: Math.floor(totalPoints) }
        
      case 'getUserPoints':
        // 获取用户当前梦想分
        const userPoints = await db.collection('users').where({ _openid: data.openid }).get()
        if (userPoints.data.length === 0) return { dreamPoints: 0 }
        return { dreamPoints: userPoints.data[0].dreamPoints }
        
      case 'consumePoints':
        // 消费梦想分
        const userToUpdate = await db.collection('users').where({ _openid: data.openid }).get()
        if (userToUpdate.data.length === 0) return { success: false, message: '用户不存在' }
        
        const currentPoints = userToUpdate.data[0].dreamPoints
        if (currentPoints < data.points) {
          return { success: false, message: '梦想分不足' }
        }
        
        await db.collection('users').where({ _openid: data.openid }).update({
          data: {
            dreamPoints: db.command.inc(-data.points),
            updatedAt: db.serverDate()
          }
        })
        
        // 记录消费记录
        await db.collection('achievements').add({
          data: {
            userOpenid: data.openid,
            type: 'points_consumed',
            points: data.points,
            reason: data.reason || '消费梦想分',
            createdAt: db.serverDate()
          }
        })
        
        return { success: true, remainingPoints: currentPoints - data.points }
        
      default:
        return { error: '未知操作' }
    }
  } catch (error) {
    console.error('梦想分计算错误:', error)
    return { error: error.message }
  }
}