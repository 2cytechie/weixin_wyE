const db = wx.cloud.database();
const app = getApp();

Page({
  // 页面数据
  data: {
    addressList: [], // 地址列表
    loading: true,  // 加载状态
    error: null ,     // 错误信息
    canSelectAddress: false, // 是否允许选择地址（默认不允许）
    fromIndex: false // 是否来自 index 页面
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 跳转到添加地址页面
  navigateToAddAddress() {
  wx.redirectTo({
    url: '/pages/addAddress/addAddress'
  })
  },

  // 页面加载时获取地址数据
  onLoad: function() {
    this.getAddressList();
    
    // 获取当前页面栈
    const pages = getCurrentPages();
    // 获取上一个页面（来源页面）
    const prevPage = pages[pages.length - 2];
    
    // 检查是否有来源页面
    let isFromTakeout = false;
    if (prevPage) {
      const prevPagePath = prevPage.route;
      console.log('来源页面路径:', prevPagePath);
      isFromTakeout = /takeout/i.test(prevPagePath)||/express/i.test(prevPagePath)||/canteen/i.test(prevPagePath)||/supermarket/i.test(prevPagePath)||/replace/i.test(prevPagePath)||/ershou/i.test(prevPagePath)||/more/i.test(prevPagePath);
    } else {
      console.warn('没有上一页信息');
    }
    
    this.setData({
      fromTakeout: isFromTakeout,
      canSelectAddress: isFromTakeout
    });
     console.log(this.data.canSelectAddress)
    if (isFromTakeout) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      });
    }
  },
    
  // 页面显示时刷新数据
  onShow: function() {
    // 检查是否需要刷新数据（例如从添加/编辑页面返回时）
    if (this.data.needRefresh) {
      this.setData({ needRefresh: false });
      this.getAddressList();
    }
  },

  // 获取地址列表
  getAddressList: function() {
    const Locations = wx.getStorageSync('user_data').locations;
    this.setData({
      addressList: Locations,
      loading: false
    });
  },

//点击插看备注
sidenote(e){
  const sidenote = e.currentTarget.dataset.sidenote;
 console.log(sidenote)
wx.showModal({
  showCancel:false,
  title: '备注信息',
  content: sidenote || '暂无备注',
  complete: (res) => {
   
    if (res.confirm) {
      
    }
  }
})

},

  

  // 删除地址
  handleDelete(e){
  let id=e.currentTarget.dataset.id
  wx.showModal({
    title: '是否删除',
    content: '',
    complete: (res) => {
      if (res.cancel) {
        
      }
      if (res.confirm) {
        wx.showLoading({
          title: '正在删除',
        })
        const Locations = wx.getStorageSync('user_data').locations;
        const newLocations = Locations.filter(item => item.id !== id);
        app.update_user_data("locations",newLocations);
        let UserData = wx.getStorageSync('user_data');
        UserData.locations = newLocations;
        wx.setStorageSync('user_data', UserData);
        setTimeout(() => {
          wx.hideLoading()
            wx.showToast({
                title: '删除成功',
            })
        }, 1000);
        this.getAddressList();
      }
    }
  })

  },

 // 编辑地址
 handleEdit: function (e) {
  const addressId = e.currentTarget.dataset.id;
  // 跳转到编辑地址页面，并通过 URL 参数传递地址 ID
  wx.redirectTo({
    url: `/pages/addAddress/addAddress?id=${addressId}`
  })
},

chooseAddress: function(e) { // 添加事件参数 e
  if (this.data.canSelectAddress) {
    console.log('选择成功');
    
    // 从事件中获取选中的地址数据（假设WXML中绑定了 data-item="{{item}}"）
    const selectedAddress = e.currentTarget.dataset.item;
    
    if (!selectedAddress) {
      console.error('未获取到地址数据');
      return;
    }

    // **关键修改**：通过 `wx.navigateBack` 返回上一页，并传递地址数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一个页面（takeout页面）
    
    if (prevPage && prevPage.setSelectedAddress) {
      // 直接调用上一页的方法传递地址数据（更高效的跨页面通信）
      prevPage.setSelectedAddress(selectedAddress);
    } else {
      // 备用方案：使用本地存储传递数据
      wx.setStorageSync('selectedAddress', selectedAddress);
    }

    // 返回上一页（非重定向，保留页面栈）
    wx.navigateBack({ delta: 1 });
  }
},


})


