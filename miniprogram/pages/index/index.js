Page({
  data: {
      imageUrl: '/images/1.png',
      isPreview: false,
      isScaled: false
  },
  previewImage() {
      this.setData({
          isPreview: true
      });
  },
  closePreview() {
      this.setData({
          isPreview: false,
          isScaled: false
      });
  },
  onScaleChange(e) {
      this.setData({
          isScaled: e.detail.scale!== 1
      });
  },
  onScale(e) {
      this.setData({
          isScaled: e.detail.scale!== 1
      });
  }
});
  