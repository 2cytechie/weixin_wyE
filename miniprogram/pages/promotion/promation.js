// js
const db = wx.cloud
Page({
  data:{
    takeout_data:{
      name:"",
      phone:"",
      make_promation_time:""
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
  order() {
    // 检查信息是否为空
    const requiredFields = {
      name:"昵称",
      phone:"手机号"
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
        title: '提交申请？',
        content: '',
        complete: (res) => {
            if (res.cancel) {
                // 取消
            }
            if (res.confirm) {
                const now = new Date();
                const uploadTime = now.toLocaleString();
                this.setData({
                  'takeout_data.make_promation_time': uploadTime
                });
                // 上传信息
                db.database().collection("promation_data").add({
                    data: this.data.takeout_data,
                    success: (res) => {
                      wx.showToast({
                        title: '提交成功',
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
                        console.error('申请失败:', err);
                        wx.showToast({
                            title: '申请失败,请检查输入信息或网络',
                            icon: 'none'
                        });
                    }
                });
            }
        }
    });
  }
})