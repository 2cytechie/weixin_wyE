// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {body,totalFee,outTradeNo} = event
  const res = await cloud.cloudPay.unifiedOrder({
    openid: wxContext.OPENID,
    body,
    outTradeNo:outTradeNo,
    spbillCreateIp : wxContext.CLIENTIP,
    subMchId : "1715015051",
    totalFee : 1,// 测试
    envId: "cloud1-1gm8k64i003f436e",
    nonceStr: Math.random().toString(36).substr(2, 15),
    signType: "MD5",
    functionName: "payCallback",
  })
  return res
}