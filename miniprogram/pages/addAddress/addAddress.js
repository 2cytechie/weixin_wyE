const db = wx.cloud.database();
Page({
  data: {
    currentType: '校园地址', // 默认选中校园地址
    inputContent: '', // 智能填写区域内容
    // 表单数据
    name: '',
    mobile: '',
    address: '',
    street: '',
    floor: '',
    sidenote: '',
    // 编辑模式标识和ID
    isEditMode: false,
    addressId: null
  },

  onLoad(options) {
    // 判断是否为编辑模式（通过URL参数判断）
    if (options.id) {
      this.setData({
        isEditMode: true,
        addressId: options.id
      });
      this.loadAddressData(options.id);
    }
  },

  // 加载地址数据（编辑模式下使用）
  loadAddressData(id) {
    db.collection("location").doc(id).get()
      .then(res => {
        const addressData = res.data;
        this.setData({
          name: addressData.name,
          mobile: addressData.mobile,
          address: addressData.address,
          street: addressData.street,
          floor: addressData.floor || '',
          sidenote: addressData.sidenote,
          currentType: addressData.type || '校园地址'
        });
      })
      .catch(err => {
        console.error('获取地址数据失败：', err);
        wx.showToast({
          title: '加载地址失败，请重试',
          icon: 'none'
        });
      });
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
      success: (res) => {
        const clipboardText = res.data || '';
        this.setData({
          sidenote: clipboardText
        });
        // 调用解析函数
        this.parseAddressInfo(clipboardText);
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

  // 解析粘贴的地址信息（示例函数，需要根据实际情况完善）
  parseAddressInfo(text) {
    // 这里可以添加地址信息解析逻辑，例如使用正则表达式提取姓名、电话等
    // 示例：从文本中提取手机号（简化处理）
    const mobilePattern = /1[3-9]\d{9}/;
    const match = text.match(mobilePattern);
    if (match) {
      this.setData({
        mobile: match[0]
      });
    }
    // 可以添加更多解析逻辑...
  },

  retain() {
    // 获取表单数据
    const name = this.data.name;
    const mobile = this.data.mobile;
    const address = this.data.address;
    const street = this.data.street;
    const floor = this.data.floor || '';// 楼层信息（校外地址）
    const sidenote = this.data.sidenote; //备注信息
    
    // 数据验证
    if (!name || !mobile || !address || !street ) {
      wx.showToast({
        title: '请填写必填信息',
        icon: 'none'
      });
      return;
    }
    
    // 手机号格式验证
    const mobilePattern = /^1[3-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    // 构建提交数据
    const formData = {
      name,
      mobile,
      address,
      street,
      floor,
      type: this.data.currentType, // 地址类型（校园/校外）
      sidenote,
    };
    
    // 根据是否为编辑模式选择不同的提交方式
    if (this.data.isEditMode) {
      // 更新现有地址
      db.collection("location").doc(this.data.addressId).update({
        data: formData
      })
      .then(() => {
        wx.showToast({
          title: '地址已成功更新',
          icon: 'success'
        });
        // 返回上一页
       
        wx.redirectTo({
          url: '/pages/location/location',
        })
      })
      .catch(err => {
        console.error('更新地址失败：', err);
        wx.showToast({
          title: '更新地址失败，请重试',
          icon: 'none'
        });
      });
    } else {
      // 添加新地址（保持原有逻辑不变）
      
      
      db.collection("location").add({
        data: formData
      })
      .then(() => {
        wx.showToast({
          title: '地址已成功添加',
          icon: 'success'
        });
        // 返回上一页
        wx.redirectTo({
          url: '/pages/location/location',
        })
      })
      .catch(err => {
        console.error('添加地址失败：', err);
        wx.showToast({
          title: '添加地址失败，请重试',
          icon: 'none'
        });
      });
    }
  },

  // 表单输入事件处理
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  onAddressInput(e) {
    this.setData({
      address: e.detail.value
    });
  },

  onStreetInput(e) {
    this.setData({
      street: e.detail.value
    });
  },

  onFloorInput(e) {
    this.setData({
      floor: e.detail.value
    });
  },

  onSidenoteInput(e) {
    this.setData({
      sidenote: e.detail.value
    });
  },

  clearInput() {
    this.setData({
      sidenote: '', // 智能填写区域内容
    });
  }
});