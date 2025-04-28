// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "test",//商品名称或商品描述event.goodName
    "outTradeNo" : "2608230605"+Date.parse(new Date()),//订单号，，，唯一  >>>>>>QQ号+时间戳
    "spbillCreateIp" : wxContext.CLIENTIP,//先填这个
    "subMchId" : "1715015051",//你的商户号
    "totalFee" : 1,//支付金额，，，分 event.totalFee*100
    "envId": cloud.DYNAMIC_CURRENT_ENV,
    "functionName": "payCallback",
    "nonceStr": "shfh&8sf8s"
  })
  return res
}

