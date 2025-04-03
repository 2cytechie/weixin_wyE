
// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-6g8u7jyybab9ae76'
    })
  },
  get_openid(){
    db.callFunction({
      name: 'get_openid',
      success: res => {
        console.log(res)
        this.setData({openid:res.result.openid})
        const openid = res.result.openid;
        console.log('用户 openid：', openid);
        // 后续可用于业务逻辑，如记录用户信息
      },
      fail: err => {
        console.error('获取 openid 失败：', err);
      }
    })
  },
});
