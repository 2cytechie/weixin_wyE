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
    tmp_images : [],

    takeout_data:{
      send_location:"",
      time:"",
      images:[],
      message:"",
      count:1,
      tip:2,
      pay:2,

      order_number:"",
      upload_time:"",
      receive_time:"",
      confirm_time:"",
      service:"送快递",
      status:"待接单",
    }
  },
  set_message_data(e) {
    const Type = e.currentTarget.dataset.type;
    const value = e.detail.value;
    const dataToUpdate = {};
    dataToUpdate[`takeout_data.${Type}`] = value;
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
      message:"取件码"
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
                // 上传图片
                this.uploadImages().then(() => {
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