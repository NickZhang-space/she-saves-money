// pages/profile/profile.js
const app = getApp();
const { UserAPI, InviteAPI } = require('../../utils/api.js');

Page({
  data: {
    userInfo: null,
    points: 0,
    checkinDays: 0,
    dreamCount: 0,
    completedDreamCount: 0,
    inviteCode: '',
    invitedCount: 0
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
  },

  // 加载用户数据
  async loadUserData() {
    try {
      const userInfo = app.globalData.userInfo;
      const openid = app.globalData.openid;
      
      if (!userInfo || !openid) {
        // 如果没有用户信息，先登录
        await this.login();
        return;
      }

      // 获取邀请统计
      const inviteStats = await InviteAPI.getInviteStats(openid);

      this.setData({
        userInfo,
        points: userInfo.points || 0,
        checkinDays: userInfo.checkin_days || 0,
        dreamCount: userInfo.dream_count || 0,
        completedDreamCount: userInfo.completed_dream_count || 0,
        inviteCode: userInfo.invite_code || '',
        invitedCount: inviteStats.invited_count || 0
      });

    } catch (err) {
      console.error('加载用户数据失败:', err);
    }
  },

  // 登录
  async login() {
    try {
      wx.showLoading({ title: '登录中...' });
      
      // 获取用户信息授权
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      });

      // 调用登录接口
      const res = await UserAPI.getUserInfo();
      
      // 更新全局数据
      app.updateUserInfo({
        ...res.userInfo,
        ...userInfo
      });

      wx.hideLoading();
      this.loadUserData();

    } catch (err) {
      console.error('登录失败:', err);
      wx.hideLoading();
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  },

  // 复制邀请码
  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      }
    });
  },

  // 跳转到排行榜
  goToLeaderboard() {
    wx.navigateTo({
      url: '/pages/leaderboard/leaderboard'
    });
  },

  // 跳转到好友列表
  goToFriends() {
    wx.navigateTo({
      url: '/pages/friends/friends'
    });
  },

  // 跳转到商城
  goToShop() {
    wx.navigateTo({
      url: '/pages/shop/shop'
    });
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于她存钱',
      content: '帮助女性实现变美梦想的目标管理小程序\n\n版本：1.0.0',
      showCancel: false
    });
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '如有问题，请添加客服微信：\nkefu_tacunqian',
      showCancel: false
    });
  }
});
