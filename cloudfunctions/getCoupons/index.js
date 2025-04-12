// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('coupons').get() // 获取所有文档
    return res.data; // 返回数据给前端
  } catch (error) {
    // 记录错误并返回空数组
    console.error('[数据库查询失败]', error);
    return [];
  }
};