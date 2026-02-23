// pages/poster/poster.js
Page({
  data: {
    dreamId: ''
  },
  
  onLoad(options) {
    const { dreamId } = options;
    if (dreamId) {
      this.setData({ dreamId });
    }
  }
});
