Page({
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
  test(){
    wx.cloud.callFunction({
      name:"setUser_data",
      data:{
        phone:"19397669418",
        type:"name",
        update_data:"哈哈哈"
      }
    }).then(res=>{
      console.log(res)
    }).catch(res=>{
      console.log(res)
    })
    console.log(111)
  }
})