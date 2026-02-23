// pages/dream/dream.js
const app = getApp()

Page({
  data: {
    dreams: [], // 所有梦想
    activeTab: 'active', // 当前标签：active-进行中，completed-已完成
    showCreateModal: false, // 显示创建弹窗
    showEditModal: false, // 显示编辑弹窗
    currentDream: null, // 当前操作的梦想
    loading: true,
    
    // 创建梦想表单
    formData: {
      name: '',
      targetAmount: '',
      category: 'beauty',
      description: '',
      coverImage: ''
    },
    
    // 预设梦想分类
    categories: [
      { id: 'beauty', name: '颜值提升', icon: '/images/category-beauty.png', color: '#FF6B9D' },
      { id: 'fashion', name: '时尚穿搭', icon: '/images/category-fashion.png', color: '#9D6BFF' },
      { id: 'travel', name: '旅行度假', icon: '/images/category-travel.png', color: '#6BFF9D' },
      { id: 'digital', name: '数码产品', icon: '/images/category-digital.png', color: '#FF9D6B' },
      { id: 'study', name: '学习成长', icon: '/images/category-study.png', color: '#6B9DFF' },
      { id: 'other', name: '其他', icon: '/images/category-other.png', color: '#999999' }
    ],
    
    // 预设梦想模板
    dreamTemplates: [
      { name: '医美微整', target: 5000, category: 'beauty', icon: '/images/template-beauty.png' },
      { name: '新款包包', target: 3000, category: 'fashion', icon: '/images/template-bag.png' },
      { name: '日本旅行', target: 8000, category: 'travel', icon: '/images/template-travel.png' },
      { name: '新款手机', target: 6000, category: 'digital', icon: '/images/template-phone.png' },
      { name: '健身私教', target: 4000, category: 'study', icon: '/images/template-fitness.png' },
      { name: '家居改造', target: 10000, category: 'other', icon: '/images/template-home.png' }
    ]
  },

  onLoad: function () {
    this.loadDreams()
  },

  onShow: function () {
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
      return
    }
  },

  // 加载梦想列表
  loadDreams: function () {
    this.setData({ loading: true })
    
    // 模拟数据加载
    setTimeout(() => {
      this.setData({
        dreams: [
          {
            id: 1,
            name: '医美微整',
            target: 5000,
            current: 1250.50,
            progress: 25,
            category: 'beauty',
            description: '想要变得更美更自信',
            coverImage: '/images/dream-beauty.png',
            color: '#FF6B9D',
            createdAt: '2026-02-20',
            isActive: true
          },
          {
            id: 2,
            name: '新款包包',
            target: 3000,
            current: 800,
            progress: 27,
            category: 'fashion',
            description: '看中很久的包包',
            coverImage: '/images/dream-bag.png',
            color: '#9D6BFF',
            createdAt: '2026-02-21',
            isActive: true
          },
          {
            id: 3,
            name: '日本旅行',
            target: 8000,
            current: 2000,
            progress: 25,
            category: 'travel',
            description: '想去日本看樱花',
            coverImage: '/images/dream-travel.png',
            color: '#6BFF9D',
            createdAt: '2026-02-22',
            isActive: true
          },
          {
            id: 4,
            name: '牙齿矫正',
            target: 15000,
            current: 15000,
            progress: 100,
            category: 'beauty',
            description: '已完成矫正',
            coverImage: '/images/dream-teeth.png',
            color: '#FF9D6B',
            createdAt: '2026-01-15',
            completedAt: '2026-02-15',
            isActive: false
          }
        ],
        loading: false
      })
    }, 800)
  },

  // 切换标签
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  // 获取当前显示的梦想列表
  getDisplayDreams: function () {
    const { dreams, activeTab } = this.data
    return dreams.filter(dream => {
      if (activeTab === 'active') {
        return dream.isActive
      } else {
        return !dream.isActive
      }
    })
  },

  // 显示创建弹窗
  showCreate: function () {
    this.setData({
      showCreateModal: true,
      formData: {
        name: '',
        targetAmount: '',
        category: 'beauty',
        description: '',
        coverImage: ''
      }
    })
  },

  // 关闭创建弹窗
  closeCreateModal: function () {
    this.setData({ showCreateModal: false })
  },

  // 表单输入
  onFormInput: function (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 选择分类
  selectCategory: function (e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      'formData.category': category
    })
  },

  // 选择模板
  selectTemplate: function (e) {
    const index = e.currentTarget.dataset.index
    const template = this.data.dreamTemplates[index]
    
    this.setData({
      formData: {
        name: template.name,
        targetAmount: template.target.toString(),
        category: template.category,
        description: `实现${template.name}的梦想`,
        coverImage: template.icon
      }
    })
  },

  // 创建梦想
  createDream: function () {
    const { name, targetAmount, category, description } = this.data.formData
    
    // 表单验证
    if (!name.trim()) {
      wx.showToast({
        title: '请输入梦想名称',
        icon: 'none'
      })
      return
    }
    
    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      wx.showToast({
        title: '请输入有效的目标金额',
        icon: 'none'
      })
      return
    }
    
    const target = Number(targetAmount)
    const categoryInfo = this.data.categories.find(c => c.id === category)
    
    wx.showLoading({
      title: '创建中...',
    })
    
    // 模拟创建
    setTimeout(() => {
      wx.hideLoading()
      
      const newDream = {
        id: Date.now(),
        name: name,
        target: target,
        current: 0,
        progress: 0,
        category: category,
        description: description || `实现${name}的梦想`,
        coverImage: this.data.formData.coverImage || categoryInfo.icon,
        color: categoryInfo.color,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      }
      
      const dreams = [newDream, ...this.data.dreams]
      this.setData({ dreams })
      
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      
      this.closeCreateModal()
    }, 1000)
  },

  // 显示编辑弹窗
  showEdit: function (e) {
    const id = e.currentTarget.dataset.id
    const dream = this.data.dreams.find(d => d.id === id)
    
    if (!dream) return
    
    this.setData({
      showEditModal: true,
      currentDream: dream,
      formData: {
        name: dream.name,
        targetAmount: dream.target.toString(),
        category: dream.category,
        description: dream.description,
        coverImage: dream.coverImage
      }
    })
  },

  // 关闭编辑弹窗
  closeEditModal: function () {
    this.setData({ 
      showEditModal: false,
      currentDream: null
    })
  },

  // 更新梦想
  updateDream: function () {
    const { name, targetAmount, category, description } = this.data.formData
    const { currentDream } = this.data
    
    // 表单验证
    if (!name.trim()) {
      wx.showToast({
        title: '请输入梦想名称',
        icon: 'none'
      })
      return
    }
    
    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      wx.showToast({
        title: '请输入有效的目标金额',
        icon: 'none'
      })
      return
    }
    
    const target = Number(targetAmount)
    const categoryInfo = this.data.categories.find(c => c.id === category)
    
    wx.showLoading({
      title: '更新中...',
    })
    
    // 模拟更新
    setTimeout(() => {
      wx.hideLoading()
      
      const dreams = this.data.dreams.map(dream => {
        if (dream.id === currentDream.id) {
          return {
            ...dream,
            name: name,
            target: target,
            category: category,
            description: description || dream.description,
            coverImage: this.data.formData.coverImage || dream.coverImage,
            color: categoryInfo.color,
            // 重新计算进度
            progress: Math.min(Math.round((dream.current / target) * 100), 100)
          }
        }
        return dream
      })
      
      this.setData({ dreams })
      
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })
      
      this.closeEditModal()
    }, 800)
  },

  // 删除梦想
  deleteDream: function (e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个梦想吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          
          // 模拟删除
          setTimeout(() => {
            wx.hideLoading()
            
            const dreams = this.data.dreams.filter(dream => dream.id !== id)
            this.setData({ dreams })
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }, 800)
        }
      }
    })
  },

  // 标记为完成
  completeDream: function (e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认完成',
      content: '确定要标记这个梦想为已完成吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中...',
          })
          
          // 模拟完成
          setTimeout(() => {
            wx.hideLoading()
            
            const dreams = this.data.dreams.map(dream => {
              if (dream.id === id) {
                return {
                  ...dream,
                  isActive: false,
                  completedAt: new Date().toISOString().split('T')[0]
                }
              }
              return dream
            })
            
            this.setData({ dreams })
            
            wx.showToast({
              title: '恭喜完成梦想！',
              icon: 'success'
            })
          }, 800)
        }
      }
    })
  },

  // 重新激活梦想
  reactivateDream: function (e) {
    const id = e.currentTarget.dataset.id
    
    wx.showLoading({
      title: '激活中...',
    })
    
    // 模拟激活
    setTimeout(() => {
      wx.hideLoading()
      
      const dreams = this.data.dreams.map(dream => {
        if (dream.id === id) {
          return {
            ...dream,
            isActive: true,
            completedAt: undefined
          }
        }
        return dream
      })
      
      this.setData({ dreams })
      
      wx.showToast({
        title: '已重新激活',
        icon: 'success'
      })
    }, 800)
  },

  // 跳转到梦想详情
  goToDreamDetail: function (e) {
    const id = e.currentTarget.dataset.id
    // 这里可以跳转到梦想详情页
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadDreams()
    wx.stopPullDownRefresh()
  }
})