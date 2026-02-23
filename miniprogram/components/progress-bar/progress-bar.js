// components/progress-bar/progress-bar.js
Component({
  properties: {
    progress: {
      type: Number,
      value: 0
    },
    animated: {
      type: Boolean,
      value: true
    },
    showMilestone: {
      type: Boolean,
      value: false
    },
    height: {
      type: Number,
      value: 16
    }
  },

  data: {
    milestones: [10, 25, 50, 75, 90]
  },

  methods: {
    isMilestoneReached(milestone) {
      return this.properties.progress >= milestone;
    }
  }
});
