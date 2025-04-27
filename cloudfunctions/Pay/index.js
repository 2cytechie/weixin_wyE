// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { body, totalFee, outTradeNo } = event

  try {
    // 调用云支付统一下单接口
    const res = await cloud.cloudPay.unifiedOrder({
      "body": body, // 商品描述
      "outTradeNo": outTradeNo, // 商户订单号
      "spbillCreateIp": wxContext.CLIENTIP, // 终端 IP
      "subMchId": '1715015051', // 可选，子商户号
      "totalFee": totalFee, // 订单总金额，单位为分
      "feeType": "CNY",// 支付类型
      "envId": cloud.DYNAMIC_CURRENT_ENV, // 云开发环境 ID
      "functionName": "payCallback", // 支付结果回调云函数名
      "nonceStr": Math.random().toString(36).substr(2, 15), // 随机字符串
      "signType": "MD5", // 签名类型
      "tradeType": "JSAPI", // 交易类型
      "openid": wxContext.OPENID // 用户的 openid
    })

    // 处理返回结果
    const timeStamp = Math.floor(Date.now() / 1000).toString()
    const nonceStr = Math.random().toString(36).substr(2, 15)
    const packageStr = `prepay_id=${res.prepay_id}`
    const signType = 'MD5'

    // 生成支付签名
    const paySign = generatePaySign({
      appId: wxContext.APPID,
      // sub_appid: wxContext.APPID,
      timeStamp,
      nonceStr,
      package: packageStr,
      signType
    })

    return {
      success: true,
      payment: {
        timeStamp,
        nonceStr,
        package: packageStr,
        signType,
        // mch_id:"1715015051",
        // sub_mch_id:"1715015051",
        // nonce_str:timeStamp,
        paySign
      }
    }
  } catch (e) {
    console.error('支付统一下单失败', e)
    return {
      success: false,
      data:res,
      error: e
    }
  }
}

// 生成支付签名的辅助函数
function generatePaySign(params) {
  const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
    obj[key] = params[key]
    return obj
  }, {})

  let stringA = ''
  for (const [k, v] of Object.entries(sortedParams)) {
    if (v && k!== 'sign') {
      stringA += `${k}=${v}&`
    }
  }

  // 注意：这里的 key 需要替换为你自己的商户密钥
  const stringSignTemp = `${stringA}key=h8Uj6Zp90iwFG58nxyu749giRgonKi8g`
  return require('crypto').createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
}