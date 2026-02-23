// 社交功能云函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 好友管理
exports.friends = {
  // 添加好友
  async addFriend(userOpenid, friendOpenid) {
    // 检查是否已是好友
    const existing = await db.collection('friends').where({
      userOpenid: userOpenid,
      friendOpenid: friendOpenid,
      status: 'accepted'
    }).get()
    
    if (existing.data.length > 0) {
      return { success: false, message: '已是好友' }
    }
    
    // 创建好友关系（双向）
    const friendData = {
      userOpenid: userOpenid,
      friendOpenid: friendOpenid,
      status: 'pending', // pending, accepted, rejected
      createdAt: db.serverDate()
    }
    
    await db.collection('friends').add({
      data: friendData
    })
    
    return { success: true, message: '好友请求已发送' }
  },
  
  // 获取好友列表
  async getFriends(openid) {
    const friends = await db.collection('friends').where({
      userOpenid: openid,
      status: 'accepted'
    }).get()
    
    // 获取好友信息
    const friendList = []
    for (const friend of friends.data) {
      const userInfo = await db.collection('users').where({ _openid: friend.friendOpenid }).get()
      if (userInfo.data.length > 0) {
        friendList.push({
          openid: friend.friendOpenid,
          nickname: userInfo.data[0].nickname,
          avatar: userInfo.data[0].avatar,
          dreamPoints: userInfo.data[0].dreamPoints,
          checkinDays: userInfo.data[0].checkinDays
        })
      }
    }
    
    return friendList
  }
}

// 浇花互动
exports.watering = {
  // 给好友的梦想浇花
  async waterDream(userOpenid, friendOpenid, dreamId) {
    // 检查今天是否已浇过
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existing = await db.collection('waterings').where({
      fromUser: userOpenid,
      toUser: friendOpenid,
      dreamId: dreamId,
      wateringDate: db.command.gte(today)
    }).get()
    
    if (existing.data.length > 0) {
      return { success: false, message: '今天已浇过花' }
    }
    
    // 记录浇花
    const wateringData = {
      fromUser: userOpenid,
      toUser: friendOpenid,
      dreamId: dreamId,
      points: 5, // 每次浇花奖励5梦想分
      wateringDate: db.serverDate(),
      createdAt: db.serverDate()
    }
    
    await db.collection('waterings').add({
      data: wateringData
    })
    
    // 给接收方加梦想分
    await db.collection('users').where({ _openid: friendOpenid }).update({
      data: {
        dreamPoints: db.command.inc(5),
        updatedAt: db.serverDate()
      }
    })
    
    // 给发送方加少量分（鼓励互动）
    await db.collection('users').where({ _openid: userOpenid }).update({
      data: {
        dreamPoints: db.command.inc(2),
        updatedAt: db.serverDate()
      }
    })
    
    return { success: true, message: '浇花成功，好友获得5梦想分' }
  }
}

// 组队挑战
exports.teamChallenge = {
  // 创建组队挑战
  async createChallenge(creatorOpenid, challengeData) {
    const challenge = {
      creatorOpenid: creatorOpenid,
      title: challengeData.title,
      description: challengeData.description,
      targetAmount: challengeData.targetAmount, // 团队目标金额
      currentAmount: 0,
      duration: challengeData.duration, // 挑战天数
      startDate: db.serverDate(),
      endDate: new Date(Date.now() + challengeData.duration * 24 * 60 * 60 * 1000),
      status: 'active', // active, completed, failed
      members: [creatorOpenid],
      createdAt: db.serverDate()
    }
    
    const result = await db.collection('teamChallenges').add({
      data: challenge
    })
    
    return { success: true, challengeId: result._id }
  },
  
  // 加入挑战
  async joinChallenge(userOpenid, challengeId) {
    const challenge = await db.collection('teamChallenges').doc(challengeId).get()
    if (!challenge.data) return { success: false, message: '挑战不存在' }
    
    // 检查是否已加入
    if (challenge.data.members.includes(userOpenid)) {
      return { success: false, message: '已加入该挑战' }
    }
    
    // 更新成员列表
    await db.collection('teamChallenges').doc(challengeId).update({
      data: {
        members: db.command.push(userOpenid)
      }
    })
    
    return { success: true, message: '成功加入挑战' }
  }
}

// 主函数
exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'addFriend':
        return await exports.friends.addFriend(data.userOpenid, data.friendOpenid)
      case 'getFriends':
        return await exports.friends.getFriends(data.openid)
      case 'waterDream':
        return await exports.watering.waterDream(data.userOpenid, data.friendOpenid, data.dreamId)
      case 'createChallenge':
        return await exports.teamChallenge.createChallenge(data.creatorOpenid, data.challengeData)
      case 'joinChallenge':
        return await exports.teamChallenge.joinChallenge(data.userOpenid, data.challengeId)
      default:
        return { error: '未知操作' }
    }
  } catch (error) {
    console.error('社交功能错误:', error)
    return { error: error.message }
  }
}