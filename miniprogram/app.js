
// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-1gm8k64i003f436e'
    })
  },
  update_user_data(phone,type,update_data){
    wx.cloud.callFunction({
      name:"setUser_data",
      data:{
        phone:phone,
        type:type,
        update_data:update_data
      }
    }).then(res=>{
      console.log("user_data.",type,"修改为：",update_data)
    })
    .catch(res=>{
      console.log(res)
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
  test(){
    console.log("appfunction")
  },
  Pay(){
    wx.request({
      url: 'https://cloud1-1gm8k64i003f436e.ap-shanghai.tcbautomation.cn/Automation/Webhook/DirectCallback/100042028545/ezzf_bce48ac/trigger_pqmxc5xxx/1J2yegNcHtpjb8yF',
      method:"POST",
      data:{
        "description": "商品描述(类型为string)",
        "out_trade_no": "商户订单号(类型为string)   唯一",
        "time_expire": "交易结束时间(类型为string)",
        "support_fapiao": "true",
        "amount": {
            "total": "总金额(类型为number)    以分为单位",
            "currency": "CNY"
        },
        "payer": {
            "openid": "用户标识(类型为string)"
        }
    }.then(res=>{
      
    })
    })
  }
});
