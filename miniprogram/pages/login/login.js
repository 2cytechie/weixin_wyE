// pages/login/login.js
const db = wx.cloud
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:"",

    openid : "",
    phoneList: [],

    isAgree: true,
    showPhonePopup: false
  },

  get_openid(){
    db.callFunction({
      name: 'get_openid',
      success: res => {
        console.log(res)
        this.setData({openid:res.result.openid})
        const openid = res.result.openid;
        console.log('用户 openid：', openid);
        // 后续可用于业务逻辑，如记录用户信息
      },
      fail: err => {
        console.error('获取 openid 失败：', err);
      }
    })
  },

  handleGetPhoneNumber(e){
    console.log(e)
  },

    test(){
      const now = new Date();
      const uploadTime = now.toLocaleString();
      console.log(uploadTime)
    },
  

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