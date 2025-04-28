const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { body, totalFee, outTradeNo } = event

  try {
    // 调用统一下单接口
    const res = await cloud.cloudPay.unifiedOrder({
      body,
      outTradeNo,
      spbillCreateIp: wxContext.CLIENTIP,
      subMchId: "1715015051",
      totalFee,
      feeType: "CNY",
      envId: cloud.DYNAMIC_CURRENT_ENV,
      functionName: "payCallback",
      tradeType: "JSAPI",
      openid: wxContext.OPENID
    })

    // 生成支付参数
    const timeStamp = Math.floor(Date.now() / 1000).toString()
    const signParams = {
      appId: wxContext.APPID,
      timeStamp,
      nonceStr: res.nonce_str,
      package: `prepay_id=${res.prepay_id}`,
      signType: 'MD5'
    }

    return {
      success: true,
      payment: {
        ...signParams,
        paySign: generatePaySign(signParams, "h8Uj6Zp90iwFG58nxyu749giRgonKi8g")
      }
    }
  } catch (e) {
    console.error('支付失败', e)
    return {
      success: false,
      code: e.errCode || 500,
      msg: '支付请求失败'
    }
  }
}

function generatePaySign(params, apiKey) {
  const sortedStr = Object.keys(params)
    .filter(k => params[k] && k !== 'sign')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  
  return crypto
    .createHash('md5')
    .update(sortedStr + '&key=' + apiKey)
    .digest('hex')
    .toUpperCase()
}