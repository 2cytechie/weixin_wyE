
// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-1gm8k64i003f436e'
    })
  },
  update_user_data(phone,type,update_data){
    wx.cloud.callFunction({
      name:"setUser_data",
      data:{
        phone:phone,
        type:type,
        update_data:update_data
      }
    }).then(res=>{
      console.log("user_data.",type,"修改为：",update_data)
    })
    .catch(res=>{
      console.log(res)
    })
  },
  get_openid(){
    db.cloud.callFunction({
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
  async  Pay(body, totalFee,outTradeNo, toPage) {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'Pay',
            data: {
                body,
                totalFee,
                outTradeNo
            },
            success: res => {
                let payment = res.result.payment;
                wx.requestPayment({
                    nonceStr: payment.nonceStr,
                    package: payment.package,
                    paySign: payment.paySign,
                    timeStamp: payment.timeStamp,
                    signType: payment.signType,
                    success: (res) => {
                        wx.showToast({
                            title: '下单成功',
                            icon: 'success',
                            success: () => {
                                setTimeout(() => {
                                    wx.switchTab({
                                        url: toPage,
                                        success: () => {
                                            resolve();
                                        },
                                        fail: (err) => {
                                            reject(err);
                                        }
                                    });
                                }, 1500);
                            }
                        });
                        console.log("支付成功", res);
                    },
                    fail: (err) => {
                        console.error('下单失败:', err);
                        wx.showToast({
                            title: '下单失败,请检查输入信息或网络',
                            icon: 'none'
                        });
                        reject(err);
                    }
                });
            },
            fail: (err) => {
                console.error("云函数调用失败", err);
                reject(err);
            }
        });
    });
},

// 测试
async  Test(body, totalFee,outTradeNo, toPage) {
  return new Promise((resolve, reject) => {
    wx.switchTab({
      url:"/pages/start/start",
      success: () => {
          resolve();
      },
      fail: (err) => {
          reject(err);
      }
  });

  })
},

});
