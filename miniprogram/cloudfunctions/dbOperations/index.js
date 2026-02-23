// 数据库操作云函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 用户管理
exports.user = {
  // 获取用户信息
  async getUser(openid) {
    return await db.collection('users').where({ _openid: openid }).get()
  },
  
  // 创建/更新用户
  async updateUser(openid, userInfo) {
    const userData = {
      _openid: openid,
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      dreamPoints: 0, // 初始梦想分
      totalSaved: 0, // 累计节省金额
      checkinDays: 0, // 连续打卡天数
      lastCheckin: null, // 最后打卡时间
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
    
    const user = await this.getUser(openid)
    if (user.data.length > 0) {
      // 更新用户
      return await db.collection('users').where({ _openid: openid }).update({
        data: {
          ...userData,
          updatedAt: db.serverDate()
        }
      })
    } else {
      // 创建用户
      return await db.collection('users').add({
        data: userData
      })
    }
  },
  
  // 更新梦想分
  async updateDreamPoints(openid, points) {
    return await db.collection('users').where({ _openid: openid }).update({
      data: {
        dreamPoints: db.command.inc(points),
        updatedAt: db.serverDate()
      }
    })
  }
}

// 梦想管理
exports.dream = {
  // 获取用户所有梦想
  async getUserDreams(openid) {
    return await db.collection('dreams').where({ userOpenid: openid }).orderBy('createdAt', 'desc').get()
  },
  
  // 创建梦想
  async createDream(openid, dreamData) {
    const dream = {
      userOpenid: openid,
      title: dreamData.title,
      type: dreamData.type, // 医美、奢侈品、旅行等
      targetAmount: dreamData.targetAmount, // 目标金额
      currentAmount: 0, // 当前金额
      whyWant: dreamData.whyWant, // 为什么想要
      milestoneCelebrated: false, // 里程碑是否庆祝
      status: 'active', // active, completed, abandoned
      progress: 0, // 进度百分比
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
    
    return await db.collection('dreams').add({
      data: dream
    })
  },
  
  // 更新梦想进度
  async updateDreamProgress(dreamId, amount) {
    const dream = await db.collection('dreams').doc(dreamId).get()
    if (!dream.data) return null
    
    const currentAmount = dream.data.currentAmount + amount
    const progress = Math.min(100, (currentAmount / dream.data.targetAmount) * 100)
    const status = progress >= 100 ? 'completed' : 'active'
    
    return await db.collection('dreams').doc(dreamId).update({
      data: {
        currentAmount: currentAmount,
        progress: progress,
        status: status,
        updatedAt: db.serverDate()
      }
    })
  }
}

// 打卡记录
exports.checkin = {
  // 今日是否已打卡
  async hasCheckedInToday(openid) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return await db.collection('checkins').where({
      userOpenid: openid,
      checkinDate: db.command.gte(today)
    }).get()
  },
  
  // 打卡
  async checkin(openid, savedAmount, note) {
    const hasChecked = await this.hasCheckedInToday(openid)
    if (hasChecked.data.length > 0) {
      return { success: false, message: '今日已打卡' }
    }
    
    const checkinData = {
      userOpenid: openid,
      savedAmount: savedAmount, // 节省金额
      note: note, // 打卡备注
      dreamPoints: Math.floor(savedAmount), // 节省1元=1梦想分
      checkinDate: db.serverDate(),
      createdAt: db.serverDate()
    }
    
    // 创建打卡记录
    const result = await db.collection('checkins').add({
      data: checkinData
    })
    
    // 更新用户连续打卡天数
    await this.updateCheckinDays(openid)
    
    // 更新用户梦想分
    await exports.user.updateDreamPoints(openid, checkinData.dreamPoints)
    
    return { success: true, data: result }
  },
  
  // 更新连续打卡天数
  async updateCheckinDays(openid) {
    const user = await exports.user.getUser(openid)
    if (user.data.length === 0) return
    
    const lastCheckin = user.data[0].lastCheckin
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    if (!lastCheckin) {
      // 第一次打卡
      await db.collection('users').where({ _openid: openid }).update({
        data: {
          checkinDays: 1,
          lastCheckin: db.serverDate()
        }
      })
    } else {
      const lastDate = new Date(lastCheckin)
      const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
      const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // 连续打卡
        await db.collection('users').where({ _openid: openid }).update({
          data: {
            checkinDays: db.command.inc(1),
            lastCheckin: db.serverDate()
          }
        })
      } else if (diffDays > 1) {
        // 断签，重新开始
        await db.collection('users').where({ _openid: openid }).update({
          data: {
            checkinDays: 1,
            lastCheckin: db.serverDate()
          }
        })
      }
    }
  }
}

// 主函数
exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'getUser':
        return await exports.user.getUser(data.openid)
      case 'updateUser':
        return await exports.user.updateUser(data.openid, data.userInfo)
      case 'updateDreamPoints':
        return await exports.user.updateDreamPoints(data.openid, data.points)
      case 'getUserDreams':
        return await exports.dream.getUserDreams(data.openid)
      case 'createDream':
        return await exports.dream.createDream(data.openid, data.dreamData)
      case 'updateDreamProgress':
        return await exports.dream.updateDreamProgress(data.dreamId, data.amount)
      case 'hasCheckedInToday':
        return await exports.checkin.hasCheckedInToday(data.openid)
      case 'checkin':
        return await exports.checkin.checkin(data.openid, data.savedAmount, data.note)
      default:
        return { error: '未知操作' }
    }
  } catch (error) {
    console.error('数据库操作错误:', error)
    return { error: error.message }
  }
}