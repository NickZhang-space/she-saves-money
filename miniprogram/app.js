// app.js
App({
  onLaunch: function () {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloudbase-1g5gu0003011e0', // 云开发环境ID
        traceUser: true,
      })
    }

    // 获取用户信息
    this.getUserInfo()
  },

  globalData: {
    userInfo: null,
    openid: null,
    isLogin: false,
  },

  // 获取用户信息
  getUserInfo: function () {
    const that = this
    // 检查本地存储
    const userInfo = wx.getStorageSync('userInfo')
    const openid = wx.getStorageSync('openid')
    
    if (userInfo && openid) {
      that.globalData.userInfo = userInfo
      that.globalData.openid = openid
      that.globalData.isLogin = true
      return
    }

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 获取openid
          wx.cloud.callFunction({
            name: 'login',
            data: {
              code: res.code
            },
            success: res => {
              const openid = res.result.openid
              that.globalData.openid = openid
              wx.setStorageSync('openid', openid)
              
              // 获取用户信息
              wx.getUserProfile({
                desc: '用于完善会员资料',
                success: res => {
                  const userInfo = res.userInfo
                  that.globalData.userInfo = userInfo
                  that.globalData.isLogin = true
                  wx.setStorageSync('userInfo', userInfo)
                  
                  // 保存用户信息到数据库
                  wx.cloud.callFunction({
                    name: 'updateUserInfo',
                    data: {
                      openid: openid,
                      userInfo: userInfo
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  // 检查登录状态
  checkLogin: function () {
    if (!this.globalData.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    return true
  }
})