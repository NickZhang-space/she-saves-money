// pages/index/index.js
const app = getApp();
const { DreamAPI } = require('../../utils/api.js');
const { showLoading, hideLoading, showError } = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    points: 0,
    checkinDays: 0,
    dreams: [],
    loading: true,
    isEmpty: false
  },

  onLoad() {
    this.loadUserInfo();
    this.loadDreams();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadDreams();
  },

  // 加载用户信息
  async loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo,
        points: userInfo.points || 0,
        checkinDays: userInfo.checkin_days || 0
      });
    }
  },

  // 加载梦想列表
  async loadDreams() {
    try {
      showLoading('加载中...');
      const openid = app.globalData.openid;
      
      if (!openid) {
        hideLoading();
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      const res = await DreamAPI.getDreamList(openid);
      
      this.setData({
        dreams: res.data || [],
        isEmpty: !res.data || res.data.length === 0,
        loading: false
      });
      
      hideLoading();
    } catch (err) {
      console.error('加载梦想列表失败:', err);
      hideLoading();
      this.setData({
        loading: false,
        isEmpty: true
      });
    }
  },

  // 跳转到创建梦想页
  goToCreate() {
    wx.navigateTo({
      url: '/pages/dream-create/dream-create'
    });
  },

  // 跳转到梦想详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/dream-detail/dream-detail?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadDreams().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
