// js
const db = wx.cloud
Page({
  data: {
    isAgree: false,
    pageSize: 5, // 每页加载的数据数量
    currentPage: 1, // 当前页码
    hasMoreData: true, // 是否还有更多数据

    tmp_image:"",
    takeout_data:{
      id_image:"",
      name:"",
      id_number:"",
      make_takerer_time:""
    },
    is_orderer:false,
    PickOrders:[],
    data_list: [
      {
        avatar:"cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png",
      phone:"1676934923",
      pick_location:"东门口",
      send_location:"三号楼",
      time:"23:12",
      message:"取来放门口",
      images:[],
      count:1,
      tip:3,
      pay:3,
      is_payed:false,
      viewCount:0,

      taker_avatar:"/images/4.png",
      taker_name:"讲究名字",
      taker_send_time:"2025年12月12日",
      profit:3,

      outTradeNo:"937597495734759",
      upload_time:"2025年12月11日",
      receive_time:"2025年12月12日",
      confirm_time:"2025年12月12日",
      service:"食堂带饭",
      status:"待接单",
      },
      // 其他任务数据...
    ]
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

  loadData: function () {
    const { pageSize, currentPage } = this.data;
    const skip = (currentPage - 1) * pageSize;

    console.log(this.data.PickOrders)
    // 构建查询条件 只能查询到已经支付的订单 测试
    db.database().collection('takeout_data')
      .where({
        outTradeNo:this.data.PickOrders
      })
      .skip(skip)
      .limit(pageSize)
      .get()
      .then(res => {
        const newData = res.data;
        if (newData.length < pageSize) {
            // 如果返回的数据数量小于每页加载的数量，说明没有更多数据了
            this.setData({
                hasMoreData: false
            });
        }
        this.setData({
            data_list: this.data.data_list.concat(newData),
            currentPage: currentPage + 1
        });
    })
    .catch(err => {
        console.error('数据加载失败', err);
        // 给用户显示加载失败的提示
        wx.showToast({
            title: '数据加载失败，请稍后重试',
            icon: 'none'
        });
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

  

  onReady(){
    const IsOrderer = wx.getStorageSync('user_data').is_orderer;
    const Pick_orders = wx.getStorageSync('user_data').pick_orders;
    this.setData({
      is_orderer:IsOrderer,
      PickOrders:Pick_orders
    })
    this.loadData()
  }
})