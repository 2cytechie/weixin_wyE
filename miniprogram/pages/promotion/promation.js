// js
Page({
  navBack() {
    wx.navigateBack();
  },

  navigateToRule() {
    wx.navigateTo({
      url: '/pages/rule/rule' // 替换为实际规则页面路径
    });
  },

  submitApply() {
    // 这里添加提交逻辑，如表单验证、接口调用等
    console.log('提交申请');
  }
})