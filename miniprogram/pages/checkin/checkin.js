// pages/checkin/checkin.js
const { CheckinAPI } = require('../../utils/api.js');
const { getCheckinMessage } = require('../../utils/ai-messages.js');
const { formatDate, isToday } = require('../../utils/util.js');

Page({
  data: {
    checkinDays: 0,
    totalCheckinDays: 0,
    lastCheckinDate: '',
    todayChecked: false,
    checkinHistory: [],
    currentMonth: '',
    aiMessage: '',
    animating: false
  },

  onLoad() {
    this.loadCheckinData();
  },

  onShow() {
    this.loadCheckinData();
  },

  // 加载打卡数据
  async loadCheckinData() {
    try {
      wx.showLoading({ title: '加载中...' });
      const app = getApp();
      const openid = app.globalData.openid;
      
      if (!openid) {
        wx.hideLoading();
        return;
      }
      
      // 获取打卡统计
      const stats = await CheckinAPI.getCheckinStats(openid);
      
      // 获取本月打卡记录
      const currentMonth = formatDate(new Date(), 'YYYY-MM');
      const history = await CheckinAPI.getCheckinHistory(openid, currentMonth);
      
      // 检查今天是否已打卡
      const todayChecked = stats.last_checkin_date && isToday(stats.last_checkin_date);
      
      this.setData({
        checkinDays: stats.checkin_days || 0,
        totalCheckinDays: stats.total_checkin_days || 0,
        lastCheckinDate: stats.last_checkin_date || '',
        todayChecked,
        checkinHistory: history.dates || [],
        currentMonth
      });
      
      wx.hideLoading();
    } catch (err) {
      console.error('加载打卡数据失败:', err);
      wx.hideLoading();
    }
  },

  // 打卡
  async doCheckin() {
    if (this.data.todayChecked) {
      wx.showToast({
        title: '今天已经打卡了',
        icon: 'none'
      });
      return;
    }

    if (this.data.animating) return;

    try {
      this.setData({ animating: true });
      const app = getApp();
      const openid = app.globalData.openid;
      
      if (!openid) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        this.setData({ animating: false });
        return;
      }
      
      const res = await CheckinAPI.checkin(openid);
      
      // 获取 AI 文案
      const aiMessage = getCheckinMessage(res.checkin_days);
      
      this.setData({
        aiMessage,
        todayChecked: true,
        checkinDays: res.checkin_days,
        totalCheckinDays: res.total_checkin_days
      });
      
      // 显示打卡成功动画
      this.showCheckinAnimation();
      
      // 刷新打卡历史
      setTimeout(() => {
        this.loadCheckinData();
      }, 1500);
      
    } catch (err) {
      console.error('打卡失败:', err);
      wx.showToast({
        title: '打卡失败，请重试',
        icon: 'none'
      });
      this.setData({ animating: false });
    }
  },

  // 显示打卡动画
  showCheckinAnimation() {
    // 简单的成功提示
    wx.showToast({
      title: '打卡成功 ✨',
      icon: 'success',
      duration: 2000
    });
    
    setTimeout(() => {
      this.setData({ animating: false });
    }, 2000);
  },

  // 检查日期是否已打卡
  isCheckedDate(date) {
    return this.data.checkinHistory.includes(date);
  }
});
