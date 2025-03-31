// pages/takeout/takeout.js
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,      // 控制弹窗显示
    hours: Array.from({length:24}, (_,i)=>i), // 0-23小时
    minutes: Array.from({length:60}, (_,i)=>i), // 0-59分钟
    timeIndex: [0, 0],       // 当前选中索引

    takeout_data:{
      takeout_pick_location:"",
      takeout_send_location:"",
      takeout_time:"",
      takeout_message:"",
      takeout_images:[],
      takeout_count:1,
      takeout_notes:""
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
    if (this.data.takeout_data.takeout_time) {
      const [h, m] = this.data.takeout_data.takeout_time.split(':');
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
      'takeout_data.takeout_time': time,
      showPicker: false
    });
    
    // 触发自定义事件（可选）
    this.triggerEvent('timeChange', { value: time });
  },

  chooseImage() {
    const that = this;
    const maxCount = 6;
    const currentCount = this.data.takeout_data.takeout_images.length;
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
            'takeout_data.takeout_images': that.data.takeout_data.takeout_images.concat(newImages)
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
    const imageList = this.data.takeout_data.takeout_images;
    imageList.splice(index, 1);
    this.setData({
      'takeout_data.takeout_images': imageList
    });
  },
  handleDecrease() {
    if (this.data.takeout_data.takeout_count > 1) {
      this.setData({
        'takeout_data.takeout_count': this.data.takeout_data.takeout_count - 1
      })
    }
  },

  handleIncrease() {
    this.setData({
      'takeout_data.takeout_count': this.data.takeout_data.takeout_count + 1
    })
  },
  order(){
    wx.showModal({
      title: '确定下单',
      content: '',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          db.collection("takeout_data").add({
              data: this.data.takeout_data,
              success: (res) => {
                  // console.log('下单成功，记录 ID:', res._id);
                  wx.showToast({
                      title: '下单成功',
                      icon: 'success'
                  });
              },
              fail: (err) => {
                  console.error('下单失败:', err);
                  wx.showToast({
                      title: '下单失败',
                      icon: 'none'
                  });
              }
          });
      }
      }
    })
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