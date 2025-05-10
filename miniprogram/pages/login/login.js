// pages/login/login.js
const db = wx.cloud
const app = getApp()
Page({
  data: {
    test:"11",

    phone:"",
    // 私人数据(进创建者可访问) 注意利用云函数返回特定字符
    user_data:{
      avatar:"cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png",
      name:"点击修改昵称",
      gender:"男",
      phone:"",
      money:0,
      login_time:"",
      // 测试
      is_orderer:true,
      true_name:"",
      make_orderer_time:"",
      is_promoter:false,
      make_promoter_time:"",
      send_orders:[],
      pick_orders:[],
      locations:[],
      coupons:[],
      cards:[],
      message:[]
    }
  },
  Login(e) {
    const cloudId = e.detail.cloudID
    wx.cloud.callFunction({
      name:"get_phoneNumber",
      data:{
        weRunData:wx.cloud.CloudID(cloudId)
      }
    }).then(res=>{
      console.log(res.result)
      this.setData({
        phone:res.result
      })
      const userData = wx.getStorageSync('user_data')
      if(userData.phone && this.data.phone === userData.phone){
        // 和之前登录的手机号一致不用发起请求
        console.log("手机号一致")
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/my/my',
            });
            }, 1500);
          }
        });
        return;
      }
      this.uploaddata()
    })
  },
  uploaddata(){
    db.database().collection("user_data").where({
      phone: this.data.phone
    }).get().then(res => {
      if (res.data.length === 0) {
        const now = new Date();
        const uploadTime = now.toLocaleString();
        this.setData({
          "user_data.login_time": uploadTime,
          "user_data.phone": this.data.phone,
          phone: this.data.phone
        });
        this.uploadImage().then(() => {
          // 保存用户信息到本地
          wx.setStorageSync('user_data', this.data.user_data);
          // 将用户信息保存到私人数据库
          db.database().collection("user_data").add({
            data: this.data.user_data,
            success: (res) => {
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                success: () => {
                  // setTimeout(() => {
                  //   wx.switchTab({
                  //     url: '/pages/my/my',
                  //   });
                  // }, 1500);
                }
              });
            },
            fail: (res) => {
              wx.showToast({
                title: '登录失败，请稍后重试',
                icon: 'none'
              });
            }
          });
        }).catch(err => {
          console.error('上传图片失败:', err);
        });
      }
      else{
        wx.setStorageSync('user_data', res.data[0])
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/my/my',
          });
        }, 1500);
        console.log("云端登录过")
      }
    })
  },
  uploadImage() {
    return new Promise((resolve, reject) => {
      // ？？？？？？？？？？？？？？？需要更改头像路径
        const tempFilePath = this.data.user_data.avatar; // 假设这里 avatar 是单张图片的临时路径
        if (!tempFilePath || tempFilePath === "cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png") {
          console.log("没有更改头像")
          resolve();
          return;
        }
        const fileExtension = tempFilePath.split('.').pop();
        const cloudPath = `avatar/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        wx.cloud.uploadFile({
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
  pay(){
    app.Test("test",1)
  }
})