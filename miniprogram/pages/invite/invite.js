Page({

  /**
   * 页面的初始数据
   */
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'inviteCount',
      success: (res) => {
        this.setData({
          inviteCount: res.data
        });
      },
      fail: (err) => {
        console.error('获取邀请计数失败:', err);
        // 设置默认值
        this.setData({
          inviteCount: 0
        });
      },
      complete: () => {
        // 无论成功或失败都会执行
      }
    }); // 修复此处的括号
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:'E站',
      path:"/pages/zhuli2/zhuli2",
      imageUrl:"/images/游戏.png",//自定义分享图片//

    }
  },
  onShareTimeline: function () {
    
  }
})