// pages/coupons/coupons.js
Page({
  data: {
    couponList: [],       // 存储优惠券列表
    isLoading: true,      // 加载状态
    loadError: false      // 错误状态
  },

  onLoad() {
    // 页面加载时获取优惠券 
    this.fetchCoupons();
  },

  fetchCoupons() {
    // 调用云函数获取优惠券数据
    wx.cloud.callFunction({
      name: 'getCoupons',
      success: (res) => {
        // 成功时更新数据并关闭加载状态
        console.log(res.result)
        this.setData({
          couponList: res.result,
          isLoading: false
        });
      },
      fail: (err) => {
        // 失败时记录错误并显示错误提示
        console.error('[云函数调用失败]', err);
        this.setData({
          isLoading: false,
          loadError: true
        });
      }
    });
  },

  goBack() {
    // 返回上一页
    wx.navigateBack({ delta: 1 });
  }
});