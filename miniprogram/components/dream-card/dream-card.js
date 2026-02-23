// components/dream-card/dream-card.js
const { formatAmount, calculateProgress } = require('../../utils/util.js');

Component({
  properties: {
    dream: {
      type: Object,
      value: {}
    }
  },

  data: {
    progress: 0,
    currentAmount: '',
    targetAmount: '',
    categoryIcon: ''
  },

  lifetimes: {
    attached() {
      this.updateData();
    }
  },

  observers: {
    'dream': function(dream) {
      this.updateData();
    }
  },

  methods: {
    updateData() {
      const { dream } = this.properties;
      if (!dream) return;

      const progress = calculateProgress(dream.current_amount || 0, dream.target_amount || 1);
      const currentAmount = formatAmount(dream.current_amount || 0);
      const targetAmount = formatAmount(dream.target_amount || 0);

      // 获取分类图标
      const categoryIcons = {
        medical: '💄',
        luxury: '👜',
        travel: '✈️',
        study: '📚',
        fitness: '💪',
        beauty: '🦷',
        custom: '🎨'
      };

      this.setData({
        progress,
        currentAmount,
        targetAmount,
        categoryIcon: categoryIcons[dream.category] || '✨'
      });
    },

    onTap() {
      this.triggerEvent('tap', { id: this.properties.dream._id });
    }
  }
});
