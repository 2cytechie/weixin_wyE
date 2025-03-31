// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:"/images/1.png",
    is_login:false,
    userInfo:"",

    test:""
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
    // if(!this.data.is_login){
    //   wx.showModal({
    //     title: '登录提示',
    //     content: '你还没有授权登录哟！',
    //     complete: (res) => {
    //       if (res.cancel) {
            
    //       }
      
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/login/login',
    //         })
    //       }
    //     }
    //   })
    // }
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