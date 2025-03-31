// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [
      {
        id: 1,
        avatar: "/images/1.png",
        type: "取外卖",
        deadline: "17:46截止",
        status:true,
        content: "肯德基，聂女士，8604预计到校门时间:17：14备注:",
        location: "亳州学院宿舍-8栋(*楼)-****",
        reward: 3
      },
      {
        id: 1,
        avatar: "/images/1.png",
        type: "hhh",
        deadline: "17:46截止",
        status:false,
        content: "肯德基，聂女士，8604预计到校门时间:16：14备注:",
        location: "亳州学院宿舍-9栋(*楼)-****",
        reward: 80
      },
      // 其他任务数据...
    ],
    image:"/images/1.png"
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