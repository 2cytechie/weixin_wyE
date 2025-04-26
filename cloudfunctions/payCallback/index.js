// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { result_code, out_trade_no, transaction_id } = event
  if (result_code === 'SUCCESS') {
    try {
      // 假设订单信息存储在名为 'orders' 的集合中，out_trade_no 是订单号
      const orderRes = await db.collection('orders').where({
        out_trade_no: out_trade_no
      }).get()

      if (orderRes.data.length > 0) {
        const orderId = orderRes.data[0]._id
        // 更新订单状态为已支付
        await db.collection('orders').doc(orderId).update({
          data: {
            status: 'paid', // 订单状态更新为已支付
            transaction_id: transaction_id, // 记录微信支付的交易 ID
            paid_time: new Date() // 记录支付时间
          }
        })

        console.log('订单支付成功，订单号:', out_trade_no)
        return {
          success: true,
          message: '订单支付成功，状态已更新'
        }
      } else {
        console.error('未找到对应的订单，订单号:', out_trade_no)
        return {
          success: false,
          message: '未找到对应的订单'
        }
      }
    } catch (e) {
      console.error('处理支付回调时出错:', e)
      return {
        success: false,
        message: '处理支付回调时出错',
        error: e
      }
    }
  } else {
    console.error('支付失败，订单号:', out_trade_no)
    return {
      success: false,
      message: '支付失败'
    }
  }
}