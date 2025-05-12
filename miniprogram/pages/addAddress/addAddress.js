Page({
  data: {
    currentType: '校园地址', // 默认选中校园地址
    inputContent: '', // 智能填写区域内容
  },

  // 切换地址类型的函数
  switchAddressType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type
    });
  },
  handlePaste() {
    wx.getClipboardData({
     // 使用 箭头函数保持this上下文
      success: (res) => {
        const clipboardText = res.data || '';
        this.setData({
          inputContent: clipboardText
        });
        // 调用解析函数
        
      },
      fail: () => {
        wx.showToast({
          title: '粘贴失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },
  
  clearInput() {
    this.setData({
      inputContent: '', // 智能填写区域内容
    });
  }
});