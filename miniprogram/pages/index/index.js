// 在页面的 js 文件中
Page({
  onLoad: function () {
      wx.showModal({
          title: '',
          content: '助力好友',
          showCancel: false,
          confirmText: '确认助力',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击了确认助力');
                  // 在这里可以添加确认助力后的逻辑
              }
          }
      });
  }
});    