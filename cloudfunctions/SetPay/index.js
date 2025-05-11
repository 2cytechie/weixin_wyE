// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { body, totalFee, outTradeNo } = event
  
  try {
    const res = await cloud.cloudPay.unifiedOrder({
      openid: wxContext.OPENID,
      body:body,
      outTradeNo:outTradeNo,
      spbillCreateIp: wxContext.CLIENTIP,
      subMchId: "1715015051",
      totalFee: 1, // 测试
      envId: "cloud1-1gm8k64i003f436e",
      nonceStr: Math.random().toString(36).substr(2, 15),
      signType: "MD5",
      functionName: "payCallback",
    })
    
    // 确保返回正确的支付参数
    return {
      success: true,
      payment: {
        timeStamp: res.timeStamp.toString(),
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign
      },
      message: '支付参数获取成功'
    }
  } catch (err) {
    console.error('云支付错误:', err)
    return {
      success: false,
      error: err,
      message: '支付参数获取失败'
    }
  }
}