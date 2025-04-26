// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await cloud.cloudPay.unifiedOrder({
      "body": event.body,
      "outTradeNo": event.outTradeNo,
      "spbillCreateIp": event.spbillCreateIp,
      "totalFee": event.totalFee,
      "envId": cloud.DYNAMIC_CURRENT_ENV,
      "functionName": "payCallback"
    })

    const timeStamp = Math.floor(Date.now() / 1000).toString()
    const nonceStr = Math.random().toString(36).substr(2, 15)
    const packageStr = `prepay_id=${res.prepay_id}`
    const signType = 'MD5'

    // 这里需要根据实际情况生成 paySign
    const paySign = generatePaySign({
      appId: 'wx90506d67ae642335',
      timeStamp,
      nonceStr,
      package: packageStr,
      signType
    })

    return {
      payment: {
        timeStamp,
        nonceStr,
        package: packageStr,
        signType,
        paySign
      }
    }
  } catch (e) {
    console.error('生成支付参数失败:', e)
    return {
      success: false,
      error: e
    }
  }
}

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
  const stringSignTemp = `${stringA}key=wx90506d67ae642335`
  return require('crypto').createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
}