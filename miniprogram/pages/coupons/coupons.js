Page({
  data: {
    couponList: [
      {
        id: 1,
        icon: '/images/coupon-icon.png', // 替换为实际图标路径
        name: '跑腿券',
        expireTime: '2025-04-02 19:35到期',
        amount: 1,
        condition: 3
      }
    ]
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 跳转到使用优惠券页面（示例）
  goToUse() {
    wx.showToast({
      title: '前往使用优惠券',
      icon: 'none'
    });
    // 实际开发中替换为真实跳转逻辑
    // wx.navigateTo({ url: '/pages/useCoupon/useCoupon' });
  }
})