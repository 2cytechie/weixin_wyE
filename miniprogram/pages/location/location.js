Page({
  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 跳转到添加地址页面
  navigateToAddAddress() {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress' // 替换为实际添加地址页面路径
    });
  }
})