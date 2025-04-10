Page({
  data: {
    takeout_data:{
    },
    user_data:{
      avatar:"/images/4.png",
      name:"名字",
      phone:"电话"
    }
  },
  onLoad(options) {
    // 利用openid请求数据库
    const data = wx.getStorageSync('show_order_data')
    this.setData({
      takeout_data:data
      // user_data
    })
  }
});