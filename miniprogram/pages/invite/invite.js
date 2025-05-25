const db = wx.cloud.database();
// 获取当前时间
const now = new Date();
// 计算两天的毫秒数
const twoDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;
// 在当前时间的基础上加上两天的毫秒数
const newDate = new Date(now.getTime() + twoDaysInMilliseconds);
// 将新的日期转换为本地字符串格式
const uploadTime = newDate.toLocaleString();

console.log('当前时间:', now.toLocaleString());
console.log('增加两天后的时间:', uploadTime);
Page({

 data:{
  couponcount:0
 },
 
 duihuan(e) {
   
  // 获取当前邀请次数
  const { inviteCount } = this.data;
  
  // 检查是否满足兑换条件
  if (inviteCount >= 3) {
      // 执行兑换逻辑
      this.setData({
          couponcount: this.data.couponcount + 1,
          inviteCount: this.data.inviteCount - 3
      }, () => {
          console.log('成功兑换一张优惠券');
          db.collection("coupons").add({
            data:{
            name:"红包",  
            amount:"5",
            expireTime:uploadTime,
            condition:"10"
            }
          })
          // 显示成功提示
          wx.showToast({
              title: '兑换成功!',
              icon: 'success',
              duration: 2000
          });
      });
  } else {
      // 显示失败提示
      console.log('邀请次数不足，无法兑换优惠券');
      wx.showToast({
          title: `还需要邀请 ${3 - inviteCount} 人才能兑换`,
          icon: 'none',
          duration: 2000
      });
  }
},

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
          inviteCount: res.data,
        
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
    }); 
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
      title:'宁工e站',
      path:"/pages/zhuli2/zhuli2",
      imageUrl:"/images/游戏.png",//自定义分享图片//

    }
  },
  onShareTimeline: function () {
    
  }
})
