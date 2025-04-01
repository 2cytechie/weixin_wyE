// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: true,
    showPhonePopup: false,
    phoneList: []
  },
  // 勾选协议变化
  handleAgreeChange(e) {
    this.setData({
      isAgree: e.detail.value
    });
  },

  // 处理登录点击
  handleLogin() {
    if (!this.data.isAgree) {
      wx.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }

    // 模拟获取手机号
    this.getPhoneNumber();
  },

  getPhoneNumber(e){
    console.log(e)
  },
  // 模拟获取手机号
  _getPhoneNumber() {
    wx.showLoading({ title: '获取手机号中...' });
    // 实际开发中使用 wx.getUserProfile + wx.getPhoneNumber
    wx.cloud.getPhoneNumber()
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        showPhonePopup: true,
        phoneList: ['138****1234', '139****5678'] // 模拟手机号列表
      });
    }, 1000);
  },

  // 选择手机号登录
  handleSelectPhone(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.showToast({
      title: `使用${phone}登录成功`,
      icon: 'success'
    });
    // 实际开发中发送登录请求
    console.log('选择的手机号：', phone);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})