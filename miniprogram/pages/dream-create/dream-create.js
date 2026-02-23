// pages/dream-create/dream-create.js
const { DreamAPI, uploadImage } = require('../../utils/api.js');
const { yuanToFen, showLoading, hideLoading, showSuccess, showError } = require('../../utils/util.js');
const { DREAM_CATEGORIES } = require('../../utils/constants.js');

Page({
  data: {
    categories: [],
    selectedCategory: '',
    title: '',
    targetAmount: '',
    reason: '',
    imageUrl: '',
    uploading: false
  },

  onLoad() {
    // 初始化分类列表
    const categories = Object.values(DREAM_CATEGORIES);
    this.setData({ categories });
  },

  // 选择分类
  selectCategory(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedCategory: id });
  },

  // 输入标题
  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  // 输入目标金额
  onAmountInput(e) {
    this.setData({ targetAmount: e.detail.value });
  },

  // 输入原因
  onReasonInput(e) {
    this.setData({ reason: e.detail.value });
  },

  // 选择图片
  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      const tempFilePath = res.tempFilePaths[0];
      
      // 上传到云存储
      this.setData({ uploading: true });
      const cloudPath = `dreams/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
      const fileID = await uploadImage(tempFilePath, cloudPath);
      
      this.setData({
        imageUrl: fileID,
        uploading: false
      });
      
      showSuccess('图片上传成功');
    } catch (err) {
      console.error('选择图片失败:', err);
      this.setData({ uploading: false });
    }
  },

  // 提交创建
  async submit() {
    const { selectedCategory, title, targetAmount, reason, imageUrl } = this.data;
    const app = getApp();
    const openid = app.globalData.openid;

    if (!openid) {
      showError('请先登录');
      return;
    }

    // 验证
    if (!selectedCategory) {
      showError('请选择梦想类型');
      return;
    }

    if (!title || title.trim() === '') {
      showError('请输入梦想名称');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      showError('请输入有效的目标金额');
      return;
    }

    try {
      showLoading('创建中...');

      // 获取分类信息
      const category = DREAM_CATEGORIES[selectedCategory.toUpperCase()];

      const dreamData = {
        category: selectedCategory,
        category_name: category.name,
        title: title.trim(),
        target_amount: yuanToFen(parseFloat(targetAmount)),
        reason: reason.trim(),
        image_url: imageUrl || ''
      };

      await DreamAPI.createDream(openid, dreamData);
      
      hideLoading();
      showSuccess('创建成功');

      // 返回首页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error('创建梦想失败:', err);
      hideLoading();
      showError('创建失败，请重试');
    }
  }
});
