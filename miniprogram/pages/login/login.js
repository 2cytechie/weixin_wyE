// pages/login/login.js
const db = wx.cloud
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:"11",

    openid : "",
    user_data:{
      avatar:"/images/1.png",
      name:"小白",
      gender:"男",
      phones:[12345974564,159745668436],
      login_time:"注册时间",
      is_orderer:false,
      make_orderer_time:"",
      is_promoter:false,
      make_promoter_time:"",
      send_orders:["发出的订单号"],
      pick_orders:["接单的订单号"],
      locations:["我的地址"],
      coupons:["优惠卷id"],
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
        this.setData({'user_data.openid':res.result.openid})

        const openid = res.result.openid;
        console.log('用户 openid：', this.data.user_data.openid);
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

  Login(){
    // 检查是否已经登录


    const now = new Date();
    const uploadTime = now.toLocaleString();
    this.setData({
      "user_data.login_time":uploadTime
    })
    this.uploadImage().then(()=>{
      db.database().collection("user_data").add({
        data: this.data.user_data,
        success: (res) => {
          wx.showToast({
              title: '登录成功',
              icon: 'success'
          });
        },
        fail:(res)=>{
          wx.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none'
          });
        }
      })
    })
  },
  uploadImage() {
    return new Promise((resolve, reject) => {
      // ？？？？？？？？？？？？？？？需要更改头像路径
        const tempFilePath = this.data.user_data.avatar; // 假设这里 avatar 是单张图片的临时路径
        if (!tempFilePath) {
            resolve();
            return;
        }
        const fileExtension = tempFilePath.split('.').pop();
        const cloudPath = `avatar/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        db.uploadFile({
            cloudPath,
            filePath: tempFilePath,
            success: (res) => {
                this.setData({
                    'user_data.avatar': res.fileID
                });
                resolve();
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
  },
  

  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
})