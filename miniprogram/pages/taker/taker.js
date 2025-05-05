// js
const db = wx.cloud
Page({
  data: {
    isAgree: false,
    tmp_image:"",
    takeout_data:{
      id_image:"",
      name:"",
      id_number:"",
      make_takerer_time:""
    }
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType:["image"],
      sourceType: ['album', 'camera']
    }).then(res=>{
      const newImage = res.tempFiles[0].tempFilePath;
      this.setData({
        tmp_image: newImage
      });
    }).catch(res=>{
      console.log(res)
    });
  },
  set_message_data(e) {
    const takeoutType = e.currentTarget.dataset.takeout_type;
    const value = e.detail.value;
    const dataToUpdate = {};
    dataToUpdate[`takeout_data.${takeoutType}`] = value;
    this.setData(dataToUpdate);
    // console.log(this.data.takeout_data)
  },
  order() {
    // 检查信息是否为空
    if (!this.data.tmp_image) {
      wx.showToast({
          title: `请选择学生证或学籍证明`,
          icon: 'none'
      });
      return;
    }
    const requiredFields = {
      name:"姓名",
      id_number:"证件号"
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
  if (!this.data.isAgree) {
    wx.showToast({
        title: `未同意《申请接单员协议》`,
        icon: 'none'
    });
    return;
  }
    wx.showModal({
        title: '确定申请',
        content: '',
        complete: (res) => {
            if (res.cancel) {
                // 取消
            }
            if (res.confirm) {
              const now = new Date();
              const uploadTime = now.toLocaleString();
              this.setData({
                'takeout_data.upload_time': uploadTime,
                'takeout_data.pay':this.data.takeout_data.tip * this.data.takeout_data.count
              });
                // 上传图片
                this.uploadImage().then(() => {
                    // 上传信息
                    db.database().collection("takerer_data").add({
                        data: this.data.takeout_data,
                        success: (res) => {
                            wx.showToast({
                                title: '感谢您的申请',
                                icon: 'success',
                                success: () => {
                                  setTimeout(() => {
                                    wx.switchTab({
                                      url: '/pages/my/my',
                                  });
                                  }, 1500);
                              }
                            });
                        },
                        fail: (err) => {
                            console.error('上传失败:', err);
                            wx.showToast({
                                title: '上传失败,请检查输入信息或网络',
                                icon: 'none'
                            });
                        }
                    });
                }).catch((err) => {
                    console.error('图片上传失败:', err);
                });
            }
        }
    });
  },
  uploadImage() {
    return new Promise((resolve, reject) => {
        const tempFilePath = this.data.tmp_image; // 假设这里 avatar 是单张图片的临时路径
        if (!tempFilePath) {
            resolve();
            return;
        }
        const fileExtension = tempFilePath.split('.').pop();
        const cloudPath = `id_image/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        db.uploadFile({
            cloudPath,
            filePath: tempFilePath,
            success: (res) => {
                this.setData({
                    'takeout_data.id_image': res.fileID
                });
                resolve();
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
  },

  handleAgreeChange() {
    this.setData({
      isAgree: !this.data.isAgree
    });
  }
})