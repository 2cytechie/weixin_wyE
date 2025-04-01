// js
Page({
  data: {
    isAgree: false,
    imageList: []
  },

  navBack() {
    wx.navigateBack();
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          imageList: res.tempFilePaths
        });
      }
    });
  },

  handleAgreeChange(e) {
    this.setData({
      isAgree: e.detail.value[0]
    });
  }
})