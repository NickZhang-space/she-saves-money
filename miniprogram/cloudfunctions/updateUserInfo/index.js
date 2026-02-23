// cloudfunctions/updateUserInfo/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid, userInfo } = event
  const wxContext = cloud.getWXContext()

  try {
    // 检查用户是否存在
    const userRes = await db.collection('users')
      .where({
        _openid: openid
      })
      .get()

    if (userRes.data.length > 0) {
      // 更新用户信息
      await db.collection('users')
        .where({
          _openid: openid
        })
        .update({
          data: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city,
            lastLoginTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })
    } else {
      // 创建新用户
      await db.collection('users')
        .add({
          data: {
            _openid: openid,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            gender: userInfo.gender,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city,
            totalSaved: 0,
            totalDreams: 0,
            level: 1,
            experience: 0,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })
    }

    return {
      success: true,
      message: '用户信息更新成功'
    }
  } catch (err) {
    console.error('更新用户信息失败:', err)
    return {
      success: false,
      message: '更新用户信息失败',
      error: err
    }
  }
}