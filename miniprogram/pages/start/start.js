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
init() {
  wx.cloud.database().collection('Init').get()
    .then(({ data }) => {
          const { tapbarImages, notice } = this.extractData(data);
          this.setData({ notice });
          return this.downloadImages(tapbarImages);
      })
    .then(() => {
          console.log('tapbar 初始化及图片下载完成');
      })
    .catch((err) => {
          console.error('tapbar 初始化失败:', err);
      });
},

// 提取数据的辅助函数
extractData(data) {
  const tapbarImages = [];
  let notice = '';
  let imagesCount = 0;

  for (const item of data) {
      if (item.TapBarimage && imagesCount < 3) {
          tapbarImages.push(item.TapBarimage);
          imagesCount++;
      } else if (item.notice) {
          notice = item.notice;
      }
  }

  return { tapbarImages, notice };
},

// 下载图片的函数
downloadImages(fileIDs) {
  if (fileIDs.length === 0) {
      return Promise.resolve();
  }

  // 创建下载任务数组
  const downloadTasks = fileIDs.map((fileID) => {
    console.log('准备下载的文件 ID:', fileID);
    return wx.cloud.downloadFile({ fileID })
      .then((res) => {
          console.log('文件下载成功，临时路径:', res.tempFilePath);
          return res.tempFilePath;
      })
      .catch((error) => {
          console.error('文件下载失败，文件 ID:', fileID, '错误信息:', error);
          return null;
      });
  });

  // 批量处理下载任务
  return Promise.all(downloadTasks)
    .then((tempFilePaths) => {
        const validTempFilePaths = tempFilePaths.filter((path) => path!== null);
        // 设置有效图片路径到页面数据
        this.setData({ TapBarimages: validTempFilePaths });
        console.log('tapbar 图片加载成功');
    })
    .catch((error) => {
        console.error('tapbar 部分图片加载失败:', error);
        throw error;
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
    this.init()
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
