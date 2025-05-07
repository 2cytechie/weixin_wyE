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
  },

  onReady() {
    const UserData = wx.getStorageSync('user_data');
    const PickOrders = UserData.pick_orders;
    const SendOrders = UserData.send_orders;
    // 从takeout_data中请求数据
    const PickData = wx.cloud.database().collection("takeout_data").where({
      outTradeNo:PickOrders
    }).get()
    const SendData = wx.cloud.database().collection("takeout_data").where({
      outTradeNo:SendOrders
    }).get()
    console.log(PickData,SendData)
  },
})