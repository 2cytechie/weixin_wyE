// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { order_number } = event;
    const res = await db.collection('takeout_data').where({
      order_number: order_number
    }).get()
    return res.data[0];
  } catch (e) {
    console.error(e)
    return null;
  }
}