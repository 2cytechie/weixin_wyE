// js
const db = wx.cloud
const _ = db.database().command;
Page({
  data: {
    tmp_image:"",
    takeout_data:{
      id_image:"",
      name:"",
      id_number:"",
      make_takerer_time:""
    },
    is_orderer:false,

    currentTab: 0,
    tabList: [
      { title: '全部' },
      { title: '待完成' },
      { title: '已完成' }
    ],
    all_data:[],
    data_list: []

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
  const UserData = wx.getStorageSync('user_data');
  if(UserData){
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
  },

  // 标签点击切换
  switchTab(e) {
    const current = e.currentTarget.dataset.index
    this.setData({ currentTab: current },()=>{
      this.filterOrders();
    })
  },

  // 滑动切换
  handleSwiperChange(e) {
    this.setData({ currentTab: e.detail.current },()=>{
      this.filterOrders();
    })
  },

  onPullDownRefresh() {
    this.onReady()
  },

  // 筛选订单
  filterOrders() {
    const { currentTab, all_data } = this.data;
    const statusMap = ['全部', '已接单', '已完成'];
    const currentStatus = statusMap[currentTab];
    
    let filtered;
    if (currentStatus === '全部') {
      filtered = all_data;
    } else {
      filtered = all_data.filter(order => order.status === currentStatus);
    }
    
    this.setData({
      data_list: filtered
    });

  },
  show_page(e) {
    const message = e.currentTarget.dataset.idx;
    console.log("电话",message.phone)
    message.phone = this.formatPhone(message.phone)
    // 增加点击量
    wx.cloud.callFunction({
      name: 'viewCount',
      data: {
        id:message._id
      }
    })
    let new_data_list = [];
    for (let item of this.data.data_list) {
        if (item._id === message._id) {
            const newItem = {
                ...item,
                viewCount: item.viewCount ? item.viewCount + 1 : 1
            };
            new_data_list.push(newItem);
        } else {
            new_data_list.push(item);
        }
    }
    // 更新页面数据
    this.setData({
        data_list: new_data_list
    });

    wx.setStorageSync('show_order_data', message);
    wx.navigateTo({
        url: '/pages/order_message/order_message',
    });
},
// 电话号码脱敏函数
formatPhone(phone) {
  // 转为字符串（处理可能的数字类型输入）
  phone = phone.toString();
  // 检查长度（至少保留前3后2，需至少5位）
  if (phone.length < 5) return phone; // 长度不足时直接返回
  // 前3位 + 中间星号 + 后2位
  return phone.slice(0, 3) + '*'.repeat(phone.length - 5) + phone.slice(-2);
},

  

  onLoad(){
    const IsOrderer = wx.getStorageSync('user_data').is_orderer;
    const Pick_orders = wx.getStorageSync('user_data').pick_orders;
    // 从takeout_data中请求数据
    db.database().collection("takeout_data")
    .where({
      outTradeNo: _.in(Pick_orders) // 使用 .in 操作符查询多个订单号
    })
    .get()
    .then(res=>{
      this.setData({
        all_data:res.data,
        data_list:res.data,
        is_orderer:IsOrderer
      })
    })
  }
})