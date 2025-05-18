const db = wx.cloud.database();

Page({
  // 页面数据
  data: {
    addressList: [], // 地址列表
    loading: true,  // 加载状态
    error: null      // 错误信息
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 跳转到添加地址页面
  navigateToAddAddress() {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress' // 替换为实际添加地址页面路径 
    });
  },

  // 页面加载时获取地址数据
  onLoad: function() {
    this.getAddressList();
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
 
    
    // 调用云函数获取地址列表
    wx.cloud.callFunction({
      name: 'getlocation', // 云函数名称，需与实际云函数名称一致
      data: {
        // 可传递参数到云函数，例如分页信息
        page: 1,
        pageSize: 20
      },
      success: res => {
        // 成功获取数据
        console.log('[云函数] [getAddressList] 成功:', res);
        
        // 更新地址列表数据
       
        this.setData({
          addressList: res.result || [],
          loading: false
        });
      },
      fail: err => {
        // 调用云函数失败
        console.error('[云函数] [getAddressList] 失败:', err);
        this.setData({
          error: '获取地址列表失败，请稍后重试'
        });
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        });
      },
      complete: () => {
        // 隐藏加载提示
        this.setData({ loading: false });
      }
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
  console.log(id)
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
        db.collection("location").doc(id).remove()
        .then(res=>{
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
         
        this.getAddressList()

        })
      }
    }
  })

  },

 // 编辑地址
 handleEdit: function (e) {
  const addressId = e.currentTarget.dataset.id;
  // 跳转到编辑地址页面，并通过 URL 参数传递地址 ID
  wx.navigateTo({
      url: `/pages/addAddress/addAddress?id=${addressId}`
  });
}

})