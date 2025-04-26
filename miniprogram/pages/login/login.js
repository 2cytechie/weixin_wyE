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
      name:"小白小红小绿小兰",
      gender:"男",
      phone:"",
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

  pay() {
    // 生成唯一订单号（示例：时间戳 + 随机字符串）
    const outTradeNo = new Date().getTime() + Math.random().toString(36).substr(2, 5);
    wx.cloud.callFunction({
        name: 'Pay',
        data: {
            // 商品描述
            body: "test",
            // 商户系统内部订单号（需保证唯一）
            outTradeNo: outTradeNo,
            // 订单总金额（单位：分）
            totalFee: 1,
            // 终端IP（简单示例用本地回环地址，实际需替换为真实用户IP）
            spbillCreateIp: "127.0.0.1",
            // 其他可能需要传递的参数（如子商户号等，按需添加）
            // subMchId: "your_sub_mch_id"
        },
        success: res => {
            const payment = res.result.payment;
            wx.requestPayment({
               ...payment,
                success (res) {
                    console.log('pay success', res);
                    // 可在此处添加支付成功后的逻辑，如更新订单状态、提示用户等
                    wx.showToast({
                        title: '支付成功',
                        icon:'success'
                    });
                },
                fail (err) {
                    console.error('pay fail', err);
                    // 支付失败后的处理，如提示用户重新支付等
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none'
                    });
                }
            });
        },
        fail: console.error,
    });
}
  

})