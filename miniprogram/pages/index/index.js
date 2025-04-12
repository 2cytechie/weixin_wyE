// pages/coupons/coupons.js
Page({
  data: {
    couponList: [], // 关键：必须初始化！
    isLoading: true,
    loadError: false
  },

  onLoad() {
    this.fetchCoupons();
  },

  fetchCoupons() {
    wx.cloud.callFunction({
      name: 'getCoupons',
      success: ({ result }) => {
        this.setData({
          couponList: result,
          isLoading: false
        });
      },
      fail: (err) => {
        console.error('云函数调用失败：', err);
        this.setData({
          isLoading: false,
          loadError: true
        });
      }
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
