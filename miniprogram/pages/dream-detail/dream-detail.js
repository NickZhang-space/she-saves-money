// pages/dream-detail/dream-detail.js
const { DreamAPI } = require('../../utils/api.js');
const { formatAmount, calculateProgress, amountComparison } = require('../../utils/util.js');
const { getProgressMessage, getMilestoneMessage } = require('../../utils/ai-messages.js');

Page({
  data: {
    dreamId: '',
    dream: null,
    progress: 0,
    currentAmount: '',
    targetAmount: '',
    remainingAmount: '',
    aiMessage: '',
    showUpdateModal: false,
    updateAmount: ''
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ dreamId: id });
      this.loadDreamDetail();
    }
  },

  // 加载梦想详情
  async loadDreamDetail() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const res = await DreamAPI.getDreamDetail(this.data.dreamId);
      const dream = res.dream;
      
      const progress = calculateProgress(dream.current_amount, dream.target_amount);
      const currentAmount = formatAmount(dream.current_amount);
      const targetAmount = formatAmount(dream.target_amount);
      const remainingAmount = formatAmount(dream.target_amount - dream.current_amount);
      
      // 获取 AI 文案
      const aiMessage = getProgressMessage(progress);
      
      this.setData({
        dream,
        progress,
        currentAmount,
        targetAmount,
        remainingAmount,
        aiMessage
      });
      
      wx.hideLoading();
    } catch (err) {
      console.error('加载梦想详情失败:', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 显示更新进度弹窗
  showUpdate() {
    this.setData({ showUpdateModal: true });
  },

  // 隐藏更新进度弹窗
  hideUpdate() {
    this.setData({ 
      showUpdateModal: false,
      updateAmount: ''
    });
  },

  // 输入更新金额
  onUpdateAmountInput(e) {
    this.setData({ updateAmount: e.detail.value });
  },

  // 提交更新
  async submitUpdate() {
    const { updateAmount, dream } = this.data;
    
    if (!updateAmount || parseFloat(updateAmount) <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({ title: '更新中...' });
      
      const amount = Math.round(parseFloat(updateAmount) * 100); // 转为分
      await DreamAPI.updateProgress(this.data.dreamId, amount);
      
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
      
      this.hideUpdate();
      this.loadDreamDetail();
      
    } catch (err) {
      console.error('更新进度失败:', err);
      wx.hideLoading();
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      });
    }
  },

  // 分享海报
  sharePoster() {
    wx.navigateTo({
      url: `/pages/poster/poster?dreamId=${this.data.dreamId}`
    });
  },

  // 完成梦想
  async completeDream() {
    wx.showModal({
      title: '确认完成',
      content: '确定要标记这个梦想为已完成吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '处理中...' });
            await DreamAPI.completeDream(this.data.dreamId);
            wx.hideLoading();
            wx.showToast({
              title: '恭喜梦想成真！',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } catch (err) {
            console.error('完成梦想失败:', err);
            wx.hideLoading();
          }
        }
      }
    });
  }
});
