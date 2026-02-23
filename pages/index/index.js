// pages/index/index.js - "她存钱"首页
const app = getApp()
const config = require('../../config/config.js')

Page({
  data: {
    userInfo: null,
    totalSaved: 0, // 总共节省金额
    totalDreams: 0, // 梦想数量
    dreamPoints: 0, // 梦想分
    level: 1, // 等级
    todayCheckin: false, // 今日是否已打卡
    consecutiveDays: 0, // 连续打卡天数
    
    activeDreams: [], // 活跃梦想列表
    recentCheckins: [], // 最近打卡记录
    todaySaved: 0, // 今日节省
    weekSaved: 0, // 本周节省
    monthSaved: 0, // 本月节省
    
    // AI陪伴
    aiMessage: '', // 当前AI消息
    aiName: config.aiCompanion.name,
    aiAvatar: config.aiCompanion.avatar,
    
    // 梦想花园
    gardenData: {
      wateredToday: 0, // 今日已浇花次数
      maxWaterPerDay: 3, // 每日最多浇花次数
      canBeWatered: true, // 是否可被浇花
      lastWaterTime: null // 上次被浇花时间
    },
    
    showLoginModal: false,
    loading: true,
  },

  onLoad: function () {
    this.checkLoginStatus()
  },

  onShow: function () {
    if (app.globalData.isLogin) {
      this.loadData()
    }
  },

  // 检查登录状态
  checkLoginStatus: function () {
    if (!app.globalData.isLogin) {
      this.setData({
        showLoginModal: true,
        loading: false
      })
    } else {
      this.setData({
        userInfo: app.globalData.userInfo,
        loading: false
      })
      this.loadData()
    }
  },

  // 加载数据
  loadData: function () {
    this.setData({ loading: true })
    
    // 模拟数据加载
    setTimeout(() => {
      this.setData({
        totalSaved: 1250.50,
        totalDreams: 3,
        activeDreams: [
          {
            id: 1,
            name: '医美微整',
            target: 5000,
            current: 1250.50,
            progress: 25,
            image: '/images/dream-beauty.png',
            color: '#FF6B9D'
          },
          {
            id: 2,
            name: '新款包包',
            target: 3000,
            current: 800,
            progress: 27,
            image: '/images/dream-bag.png',
            color: '#9D6BFF'
          },
          {
            id: 3,
            name: '日本旅行',
            target: 8000,
            current: 2000,
            progress: 25,
            image: '/images/dream-travel.png',
            color: '#6BFF9D'
          }
        ],
        recentRecords: [
          {
            id: 1,
            amount: 25,
            description: '没喝奶茶',
            time: '今天 14:30',
            dreamName: '医美微整'
          },
          {
            id: 2,
            amount: 30,
            description: '自带午饭',
            time: '今天 12:15',
            dreamName: '新款包包'
          },
          {
            id: 3,
            amount: 15,
            description: '步行上班',
            time: '昨天 08:45',
            dreamName: '日本旅行'
          }
        ],
        todaySaved: 55,
        weekSaved: 280,
        monthSaved: 1250.50,
        loading: false
      })
    }, 1000)
  },

  // 快速记录
  quickRecord: function (e) {
    const type = e.currentTarget.dataset.type
    const amounts = {
      'coffee': 25,
      'lunch': 30,
      'transport': 15,
      'shopping': 50
    }
    
    const amount = amounts[type] || 0
    const descriptions = {
      'coffee': '没喝咖啡/奶茶',
      'lunch': '自带午饭',
      'transport': '公共交通/步行',
      'shopping': '忍住没买'
    }
    
    const description = descriptions[type] || '省钱记录'
    
    wx.showLoading({
      title: '记录中...',
    })
    
    // 模拟记录保存
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `成功记录¥${amount}`,
        icon: 'success'
      })
      
      // 更新数据
      const newTotal = this.data.totalSaved + amount
      const newToday = this.data.todaySaved + amount
      const newWeek = this.data.weekSaved + amount
      const newMonth = this.data.monthSaved + amount
      
      this.setData({
        totalSaved: newTotal,
        todaySaved: newToday,
        weekSaved: newWeek,
        monthSaved: newMonth
      })
      
      // 添加到最近记录
      const newRecord = {
        id: Date.now(),
        amount: amount,
        description: description,
        time: '刚刚',
        dreamName: '医美微整'
      }
      
      this.setData({
        recentRecords: [newRecord, ...this.data.recentRecords.slice(0, 4)]
      })
      
      // 更新梦想进度
      this.updateDreamProgress(amount)
    }, 800)
  },

  // 更新梦想进度
  updateDreamProgress: function (amount) {
    const activeDreams = this.data.activeDreams
    if (activeDreams.length > 0) {
      // 默认更新第一个梦想
      const dream = activeDreams[0]
      const newCurrent = dream.current + amount
      const newProgress = Math.min(Math.round((newCurrent / dream.target) * 100), 100)
      
      dream.current = newCurrent
      dream.progress = newProgress
      
      this.setData({
        activeDreams: activeDreams
      })
    }
  },

  // 跳转到详细记录
  goToRecord: function () {
    wx.switchTab({
      url: '/pages/record/record'
    })
  },

  // 跳转到梦想管理
  goToDream: function () {
    wx.switchTab({
      url: '/pages/dream/dream'
    })
  },

  // 跳转到社交
  goToSocial: function () {
    wx.switchTab({
      url: '/pages/social/social'
    })
  },

  // 用户登录
  handleLogin: function () {
    app.getUserInfo()
    this.setData({
      showLoginModal: false,
      userInfo: app.globalData.userInfo
    })
    this.loadData()
  },

  // 关闭登录弹窗
  closeLoginModal: function () {
    this.setData({
      showLoginModal: false
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '美丽省钱罐 - 每次忍住不买，都是离梦想更近一步',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    }
  }
})