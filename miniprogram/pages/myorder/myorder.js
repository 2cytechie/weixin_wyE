// pages/order/order.js
Page({
  data: {
    currentTab: 0,
    tabList: [
      { title: '全部' },
      { title: '待支付' },
      { title: '待接单' },
      { title: '待完成' },
      { title: '已完成' }
    ]
  },

  // 标签点击切换
  switchTab(e) {
    const current = e.currentTarget.dataset.index
    this.setData({ currentTab: current })
  },

  // 滑动切换
  handleSwiperChange(e) {
    this.setData({ currentTab: e.detail.current })
  }
})