Page({
  data: {
    activeTab: 'all'
  },

  // 切换订单分类
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    // 这里可扩展对应分类订单数据的加载逻辑
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})