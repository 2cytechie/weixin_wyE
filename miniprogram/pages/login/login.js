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
    user_data:{
      avatar:"/images/1.png",
      name:"小明",
      phone:[1909099,290849083],
      is_orderer:false,
      send_orders:["发出的订单号"],
      pick_orders:["接单的订单号"],
      locations:["我的地址"],
      coupons:["优惠卷"],
      cards:["卡号??????????????"],
      message:["我的消息"]
    },

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


  onShareAppMessage() {

  }
})