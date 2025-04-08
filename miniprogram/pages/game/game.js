// pages/takeout/takeout.js
const db = wx.cloud.database()
Page({
  data: {
    showPicker: false,      // 控制弹窗显示
    hours: Array.from({length:24}, (_,i)=>i), // 0-23小时
    minutes: Array.from({length:60}, (_,i)=>i), // 0-59分钟
    timeIndex: [0, 0],       // 当前选中索引
    select_gender:['男','女'],

    tmp_images:[],
    takeout_data:{
      send_locatin:"",
      time:"",
      message:"",
      gender:"",
      count:1,
      tip:3,

      upload_time:"",
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
  order() {
    // 检查信息是否为空
    const requiredFields = {
      message:"游戏信息",
      notes:"游戏类型",
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
                const now = new Date();
                const uploadTime = now.toLocaleString();
                this.setData({ 'takeout_data.upload_time': uploadTime });
                // 上传信息
                db.collection("takeout_data").add({
                  data: this.data.takeout_data,
                  success: (res) => {
                      wx.showToast({
                          title: '下单成功',
                          icon: 'success'
                      });
                  },
                  fail: (err) => {
                      console.error('下单失败:', err);
                      wx.showToast({
                          title: '下单失败,请检查输入信息或网络',
                          icon: 'none'
                      });
                  }
              });
            }
        }
    });
  }
});