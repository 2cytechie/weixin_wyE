// pages/takeout/takeout.js
const db = wx.cloud.database()
Page({
  data: {
    showPicker: false,      // 控制弹窗显示
    hours: Array.from({length:24}, (_,i)=>i), // 0-23小时
    minutes: Array.from({length:60}, (_,i)=>i), // 0-59分钟
    timeIndex: [0, 0],       // 当前选中索引

    tmp_images:[],
    takeout_data:{
      avatar:"cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png",
      send_location:"",
      time:"",
      message:"",
      gender:"不限",
      count:1,
      tip:3,
      pay:3,
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
      service:"游戏开黑",
      status:"待接单",
    }
  },
  set_message_data(e) {
    const takeoutType = e.currentTarget.dataset.takeout_type;
    const value = e.detail.value;
    const dataToUpdate = {};
    dataToUpdate[`takeout_data.${takeoutType}`] = value;
    this.setData(dataToUpdate);
    console.log(this.data.takeout_data)
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
    const time = `${h.toString().padStart(2, '0')}:00`;
    
    this.setData({
      'takeout_data.time': time,
      showPicker: false
    });
    
    // 触发自定义事件（可选）
    this.triggerEvent('timeChange', { value: time });
  },
  setGender(e) {
    const selectedGender = e.detail.value;
    this.setData({
        'takeout_data.gender': selectedGender
    });
  },
  order() {
    // 检查信息是否为空
    const requiredFields = {
      message:"游戏信息",
      send_location:"游戏类型",
      time:"游戏时长"
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
              const OutTradeNo = new Date().getTime().toString() + wx.getStorageSync('user_data')._openid;
              let upLoadAvatar = wx.getStorageSync('user_data').avatar;
              let phone = wx.getStorageSync('user_data').phone;
              this.setData({
                'takeout_data.upload_time': uploadTime,
                'takeout_data.pay':this.data.takeout_data.tip * this.data.takeout_data.count,
                'takeout_data.avatar':upLoadAvatar,
                'takeout_data.phone':phone
              });
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
                  const Phone = wx.getStorageSync('user_data').phone;
                  const SendOrders = wx.getStorageSync('user_data').send_orders;
                  SendOrders.push(OutTradeNo)
                  db.collection("user_data").where({
                    phone:Phone
                  }).update({
                    send_orders:SendOrders
                  })
                  console.log("支付成功",res)
                }).catch(res=>{
                  console.log("支付失败",res)
                })
              })
            }
        }
    });
  }
});