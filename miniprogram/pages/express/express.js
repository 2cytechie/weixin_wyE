const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,      // 控制弹窗显示
    hours: Array.from({length:24}, (_,i)=>i), // 0-23小时
    minutes: Array.from({length:60}, (_,i)=>i), // 0-59分钟
    timeIndex: [0, 0],       // 当前选中索引
    tmp_images : [],

    takeout_data:{
      avatar:"cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png",
      send_location:"",
      time:"",
      images:[],
      message:"",
      count:1,
      tip:2,
      pay:2,
      is_payed:false,
      viewCount:0,

      taker_avatar:"",
      taker_name:"",
      taker_send_time:"",
      profit:0,

      outTradeNo:"",
      upload_time:"",
      receive_time:"",
      confirm_time:"",
      service:"取快递",
      status:"待接单",
    }
  },
  set_message_data(e) {
    const Type = e.currentTarget.dataset.type;
    const value = e.detail.value;
    const dataToUpdate = {};
    dataToUpdate[`takeout_data.${Type}`] = value;
    this.setData(dataToUpdate);
    // console.log(this.data.takeout_data)
  },

  // 显示时间选择器
  showTimePicker() {
    this.setData({ showPicker: true });
    
    // 如果已有选择，初始化位置
    if (this.data.takeout_data.time) {
      const [h, m] = this.data.takeout_data.time.split(':');
      this.setData({
        timeIndex: [parseInt(h), parseInt(m)]
      });
    }
  },

  // 隐藏时间选择器
  hideTimePicker() {
    this.setData({ showPicker: false });
  },

  // 时间滚动变化事件
  timeChange(e) {
    this.setData({
      timeIndex: e.detail.value
    });
  },

  // 确认选择
  confirmTime() {
    const [h, m] = this.data.timeIndex;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    this.setData({
      'takeout_data.time': time,
      showPicker: false
    });
    
    // 触发自定义事件（可选）
    this.triggerEvent('timeChange', { value: time });
  },

  chooseImage() {
    const that = this;
    const maxCount = 6;
    const currentCount = this.data.tmp_images.length;
    const remainCount = maxCount - currentCount;
    if (remainCount <= 0) {
      wx.showToast({
        title: '已达到最大上传数量',
        icon: 'none'
      });
      return;
    }
    wx.chooseMedia({
      count: remainCount,
      mediaType:["image"],
      sourceType: ['album', 'camera'],
      success(res) {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        that.setData({
            tmp_images: that.data.tmp_images.concat(newImages)
        });
    },
    fail(err) {
        console.error('选择图片失败:', err);
        wx.showToast({
            title: '选择图片失败',
            icon: 'none'
        });
    }
    });
  },
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const imageList = this.data.tmp_images;
    imageList.splice(index, 1);
    this.setData({
      tmp_images: imageList
    });
  },
  handleDecrease() {
    if (this.data.takeout_data.count > 1) {
      this.setData({
        'takeout_data.count': this.data.takeout_data.count - 1
      })
    }
  },

  handleIncrease() {
    this.setData({
      'takeout_data.count': this.data.takeout_data.count + 1
    })
  },
  order() {
    // 检查信息是否为空
    const requiredFields = {
      send_location:"收货地址",
      time:"送达时间",
      // message:"取件码"
    }; // 需要检查的字段
    for (const field in requiredFields) {
      if (!this.data.takeout_data[field]) {
          wx.showToast({
              title: `请输入${requiredFields[field]}`,
              icon: 'none'
          });
          return;
      }
  }
  const UserData = wx.getStorageSync('user_data');
  if(UserData){
    wx.showModal({
        title: '确定下单',
        content: '',
        complete: (res) => {
            if (res.cancel) {
                // 取消
            }
            if (res.confirm) {
              const now = new Date();
              const uploadTime = now.toLocaleString();
              const OutTradeNo = new Date().getTime().toString();
              let upLoadAvatar =  UserData.avatar;
              let phone =  UserData.phone;
              this.setData({
                'takeout_data.upload_time': uploadTime,
                'takeout_data.pay':this.data.takeout_data.tip * this.data.takeout_data.count,
                'takeout_data.outTradeNo':OutTradeNo,
                'takeout_data.avatar':upLoadAvatar,
                'takeout_data.phone':phone
              });
                // 上传图片
                this.uploadImages().then(() => {
                  // 上传信息
                  db.collection("takeout_data").add({
                      data: this.data.takeout_data
                  }).then(res=>{
                    // 支付
                    app.Test("取外卖",this.data.takeout_data.pay*1000,OutTradeNo,'/pages/start/start').then(res=>{
                      // 更新支付状态
                      db.collection("takeout_data").where({
                        OutTradeNo
                      }).update({
                        is_payed:true
                      })
                      const Phone = UserData.phone;
                      const SendOrders = UserData.send_orders;
                      SendOrders.push(OutTradeNo);
                      UserData.send_orders = SendOrders;
                      wx.setStorageSync('user_data', UserData)
                      db.collection("user_data").where({
                        phone:Phone
                      }).update({
                        data:{
                          send_orders:SendOrders
                        }
                      })
                      console.log("支付成功",res)
                      // 测试
                      console.log("数据",this.data.takeout_data)
                    }).catch(res=>{
                      console.log("支付失败",res)
                    })
                  }).catch(res=>{
                    console.log("取外卖信息上传失败",res)
                  })
                }).catch((err) => {
                    console.error('图片上传失败:', err);
                    wx.showToast({
                        title: '图片上传失败，请重试',
                        icon: 'none'
                    });
                });
            }
        }
    });
  }
  else{
    wx.showModal({
      content: '请先登录！',
      complete: (res) => {
        if (res.cancel) {
            // 用户点击取消，可根据需求添加相应逻辑
        }
        if (res.confirm) {
          wx.navigateTo({
              url: '/pages/login/login',
          });
        }
      }
    });
  }
  },
  uploadImages() {
    return new Promise((resolve, reject) => {
        const tempFilePaths = this.data.tmp_images;
        let uploadedCount = 0;
        const totalCount = tempFilePaths.length;
        if (totalCount === 0) {
            resolve();
            return;
        }
        tempFilePaths.forEach((tempFilePath) => {
            const fileExtension = tempFilePath.split('.').pop();
            const cloudPath = `images/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
            wx.cloud.uploadFile({
                cloudPath,
                filePath: tempFilePath,
                success: (res) => {
                    const newImages = this.data.takeout_data.images.concat(res.fileID);
                    this.setData({
                        'takeout_data.images': newImages
                    });
                    uploadedCount++;
                    if (uploadedCount === totalCount) {
                        resolve();
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    });
  },
  setSelectedAddress(address) {
    this.setData({
     
      // 新增：将地址的 sidenote 赋值给备注字段
      'takeout_data.notes': address.sidenote, // 假设地址对象包含 sidenote 字段
      // 原有地址字段（根据实际结构调整）
      'takeout_data.pick_location': address.detailAddress || address.address 
    });

   
    wx.removeStorageSync('selectedAddress'); // 清除本地存储
  },
  chooseAddress(e){
    console.log("选择地址")
    wx.navigateTo({
      url: '/pages/location/location'
       // 替换为实际添加地址页面路径 
    });
   
    
  },
  onShow() {
    const address = wx.getStorageSync('selectedAddress');
    if (address) {
      this.setSelectedAddress(address);
      wx.removeStorageSync('selectedAddress');
       // 清除临时存储
    }
  }

})