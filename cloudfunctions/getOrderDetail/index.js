// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { outTradeNo } = event;
    const res = await db.collection('takeout_data').where({
      outTradeNo: outTradeNo
    }).get()
    return res.data[0];
  } catch (e) {
    console.error(e)
    return null;
  }
}