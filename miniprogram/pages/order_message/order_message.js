const app = getApp()
Page({
  data: {
    is_looding:true,
    tmp_images:[],
    takeout_data:{},
    user_data:{},

    isImageFullScreen: false,
    currentImage: "",
    scale: 1,
    initialScale: 1,
    translateX: 0,
    translateY: 0,
    initialTranslateX: 0,
    initialTranslateY: 0,
    startDistance: 0,
    startX: 0,
    startY: 0
  },
  onLoad(options) {
    const TakeoutData = wx.getStorageSync('show_order_data')
    const UserData = wx.getStorageSync('user_data')
    this.setData({
      takeout_data:TakeoutData,
      user_data:UserData
    })
    let images = this.data.takeout_data.images
    if(images.length > 0){
      this.setData({
        tmp_images:images,
        is_looding:false
      })
      // this.downloadImages(images)
    }
    else{
      this.setData({
        is_looding:false
      })
    }
  },
  downloadImages(res) {
    // 遍历所有图片fileID并下载
    const downloadTasks = res.map(fileID => 
      wx.cloud.downloadFile({
        fileID: fileID // 单个fileID
      }).then(res => {
        return res.tempFilePath; // 返回临时路径
      })
    );
  
    // 批量下载并保存结果
    Promise.all(downloadTasks)
      .then(tempFilePaths => {
        this.setData({
          tmp_images: tempFilePaths, // 保存临时路径到页面数据
          is_looding:false
        });
        console.log("message_order加载成功")
      })
      .catch(error => {
        this.setData({
          is_looding:false
        })
        console.error('message_order加载成功部分图片加载失败', error);
      });
  },
  // 优化后的JS逻辑
previewImage(e) {
  const src = e.currentTarget.dataset.src;
  this.setData({
    isImageFullScreen: true,
    currentImage: src,
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
},

closeFullScreen() {
  this.setData({
    isImageFullScreen: false,
    scale: 1,
    translateX: 0,
    translateY: 0
  });
},

onTouchStart(e) {
  if (e.touches.length === 2) {
    // 计算初始间距
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    this.startDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    this.initialScale = this.data.scale;
  } else if (e.touches.length === 1) {
    // 记录初始位置
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.initialTranslateX = this.data.translateX;
    this.initialTranslateY = this.data.translateY;
  }
},

onTouchMove(e) {
  if (e.touches.length === 2) {
    // 处理缩放
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    // 计算缩放比例并限制范围
    const newScale = Math.min(
      Math.max(
        this.initialScale * (currentDistance / this.startDistance),
        0.5
      ),
      5
    );
    
    this.setData({ scale: newScale });
  } else if (e.touches.length === 1) {
    // 处理平移
    const deltaX = e.touches[0].clientX - this.startX;
    const deltaY = e.touches[0].clientY - this.startY;
    
    // 计算新的位置并限制边界
    const maxTranslate = 100 * (this.data.scale - 1);
    const newTranslateX = Math.min(
      Math.max(
        this.initialTranslateX + deltaX,
        -maxTranslate
      ),
      maxTranslate
    );
    const newTranslateY = Math.min(
      Math.max(
        this.initialTranslateY + deltaY,
        -maxTranslate
      ),
      maxTranslate
    );
    
    this.setData({
      translateX: newTranslateX,
      translateY: newTranslateY
    });
  }
},
async receiveOrder(){
  // 判断是否是接单员
if (this.data.user_data.is_orderer) {
  // 更新云端数据
  const OutTradeNo = this.data.takeout_data.outTradeNo;
  let PickOrders = this.data.user_data.pick_orders;
  PickOrders.push(String(OutTradeNo));
  const Phone = this.data.user_data.phone;
  wx.cloud.database().collection("user_data").where({
    phone: Phone
  }).update({
    data: {
      pick_orders: PickOrders
    }
  }).then(res => {
    let UserData = wx.getStorageSync('user_data');
    UserData.pick_orders = PickOrders;
    let Receive_time = new Date().toLocaleString();
    // 同步数据
    wx.setStorageSync('user_data', UserData);
    
    wx.cloud.database().collection("takeout_data").where({
      outTradeNo: OutTradeNo
    }).update({
      data: {
        taker_avatar:UserData.avatar,
        taker_phone:UserData.phone,
        taker_name:UserData.taker_name,
        receive_time:Receive_time,
        status: "已接单"
      }
    })
    wx.showToast({
      title: '接单成功',
      icon: 'success'
    });

    // 跳转到订单页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/taker/taker',
      })
    }, 1500);
  }).catch(err => {
      console.error('更新云端数据失败:', err);
      wx.showToast({
        title: '接单失败',
        icon: 'none'
      });
  });
} else {
  wx.showModal({
    content: '请先成为接单员！',
    complete: (res) => {
      if (res.cancel) {
          // 用户点击取消，可根据需求添加相应逻辑
      }
      if (res.confirm) {
        wx.navigateTo({
            url: '/pages/taker/taker',
        });
      }
    }
  });
}
  
},

deliver(){
  wx.showModal({
    title: '已送达',
    complete: (res) => {
      if (res.cancel) {
        
      }
  
      if (res.confirm) {
        const now = new Date();
        const ConfirmTime = now.toLocaleString();
        wx.cloud.database().collection("takeout_data").where({
          outTradeNo:this.data.takeout_data.outTradeNo
        }).update({
          data:{
            status:"已完成",
            confirm_time:ConfirmTime
          }
        }).then(res=>{
          wx.navigateBack();
        })
      }
    }
  })
},
undeliver(){
  wx.showModal({
    title: '确认取消',
    complete: (res) => {
      if (res.cancel) {
        
      }
  
      if (res.confirm) {
        const UserData = wx.getStorageSync('user_data');
        let PickOrders = UserData.pick_orders;
        const OutTradeNo = this.data.takeout_data.outTradeNo;
        let newPickOrders = [];
        for(let i in PickOrders){
          if(PickOrders[i] !== OutTradeNo){
            newPickOrders.push(PickOrders[i])
          }
        }
        UserData.pick_orders = newPickOrders;
        wx.setStorageSync('user_data', UserData);
        app.update_user_data("pick_orders",newPickOrders);
        wx.cloud.database().collection("takeout_data").where({
          outTradeNo:OutTradeNo
        }).update({
          data:{
            status:"待接单",
            taker_avatar:"",
            taker_phone:"",
            taker_name:"",
            profit:0,
          }
        }).then(res=>{
          wx.navigateBack();
        })
      }
    }
  })
},

onTouchEnd() {
  // 自动居中逻辑（可选）
  if (this.data.scale === 1) {
    setTimeout(() => {
      this.setData({
        translateX: 0,
        translateY: 0
      });
    }, 200);
  }
}
});