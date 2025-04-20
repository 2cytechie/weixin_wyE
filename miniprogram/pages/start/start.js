// pages/start/start.js
var isCouponClaimed = false;
var isCouponClaimed1 = false;
var isCouponClaimed2 = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tapbar_len:3,
    TapBarimages:[],
    notice:"",

  },
  showpage(){

  },
  showpage1(ev){
    wx.navigateTo({
      url: '/pages/banner1/banner1',
      
    })
    
  },
  showpage2(ev){
    wx.navigateTo({
      url: '/pages/banner2/banner2',
      
    })
    
  },
  showpage3(ev){
    wx.navigateTo({
      url: '/pages/banner3/banner3',
      
    })
    
  },
  // 初始化数据
  init(){
    wx.cloud.database().collection('Init')
    .get()
    .then(res => {
      const tapbarImages = [];
      let images_len = 0;
      for(const item of res.data){
        if(item.TapBarimage && images_len < 3){
          tapbarImages.push(item.TapBarimage)
          images_len = images_len + 1
        }
        else if(item.notice){
          this.setData({
            notice:item.notice
          })
        }
      }
      // 将数据保存到页面
      this.downloadImages(tapbarImages)
    })
    .catch(err => {
      console.error("tapbar初始化失败"); // 更完善的错误处理
    });
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
          TapBarimages: tempFilePaths // 保存临时路径到页面数据
        });
        console.log("tapbar加载成功")
      })
      .catch(error => {
        console.error('tapbar部分图片加载失败', error);
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
    this.init()
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

  },

  linqu(e) {
    const index = e.currentTarget.dataset.index;
    // 获取当前的优惠券数组
    const coupons = this.data.coupons;
    // 将对应索引的优惠券标记为已领取
    coupons[index].isClaimed = true;
    // 更新数据状态
    this.setData({
        coupons: coupons
    });

  if (isCouponClaimed1) {
    
  
    wx.showToast({
      title: '优惠卷已领取,正在前往使用',
      icon: 'none',
    
    });
  }else{
  
    wx.showToast({
        title: '优惠券已领取',
        icon: 'none'
    });
  
    isCouponClaimed1 = true;
  
  }
 
  },
  data: {
    // 优惠券数组，每个对象代表一个优惠券
    coupons: [
        {
            isClaimed: false
        }
    ]
},
  linqu1(e) {
    const index = e.currentTarget.dataset.index;
    // 获取当前的优惠券数组
    const coupons = this.data.coupons;
    // 将对应索引的优惠券标记为已领取
    coupons[index].isClaimed1 = true;
    // 更新数据状态
    this.setData({
        coupons: coupons
    });
    if (isCouponClaimed) {
      
    
      wx.showToast({
        title: '优惠卷已领取,正在前往使用',
        icon: 'none',
      
      });
    }else{
    
      wx.showToast({
          title: '优惠券已领取',
          icon: 'none'
      });
    
      isCouponClaimed = true;
    
    }
    
    },
    
    linqu2(e) {
      const index = e.currentTarget.dataset.index;
      // 获取当前的优惠券数组
      const coupons = this.data.coupons;
      // 将对应索引的优惠券标记为已领取
      coupons[index].isClaimed2 = true;
      // 更新数据状态
      this.setData({
          coupons: coupons
      });
      if (isCouponClaimed2) {
        wx.showToast({
          title: '优惠卷已领取,正在前往使用',
          icon: 'none',
        });
      }else{
        wx.showToast({
            title: '优惠券已领取',
            icon: 'none'
        });
        isCouponClaimed2 = true;
      }
      }
})

6