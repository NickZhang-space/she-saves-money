// pages/index/index.js
const app = getApp();
const { DreamAPI, UserAPI } = require('../../utils/api.js');
const { showLoading, hideLoading, showError, showSuccess } = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    points: 0,
    checkinDays: 0,
    dreams: [],
    loading: true,
    isEmpty: false,
    isLogin: false
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (app.globalData.isLogin) {
      this.loadUserInfo();
      this.loadDreams();
    }
  },

  // 检查登录状态
  checkLogin() {
    const openid = app.globalData.openid;
    const userInfo = app.globalData.userInfo;
    
    if (openid && userInfo) {
      this.setData({ isLogin: true });
      this.loadUserInfo();
      this.loadDreams();
    } else {
      this.setData({ 
        isLogin: false,
        loading: false 
      });
    }
  },

  // 登录
  async login() {
    try {
      // 1. 调用 wx.login 获取 code
      const loginRes = await wx.login();
      const code = loginRes.code;

      // 2. 调用云函数获取 openid
      showLoading('登录中...');
      const cloudRes = await wx.cloud.callFunction({
        name: 'login',
        data: { code }
      });

      const openid = cloudRes.result.openid;
      app.globalData.openid = openid;
      wx.setStorageSync('openid', openid);

      // 3. 获取用户信息
      const profileRes = await wx.getUserProfile({
        desc: '用于完善会员资料'
      });

      const userInfo = profileRes.userInfo;
      app.globalData.userInfo = userInfo;
      app.globalData.isLogin = true;
      wx.setStorageSync('userInfo', userInfo);

      // 4. 保存用户信息到数据库
      await UserAPI.updateUserInfo(openid, userInfo);

      hideLoading();
      showSuccess('登录成功');

      // 5. 刷新页面
      this.setData({ isLogin: true });
      this.loadUserInfo();
      this.loadDreams();

    } catch (err) {
      console.error('登录失败:', err);
      hideLoading();
      showError('登录失败，请重试');
    }
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
        this.setData({
          loading: false,
          isEmpty: true
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
    if (!app.globalData.isLogin) {
      showError('请先登录');
      return;
    }
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
