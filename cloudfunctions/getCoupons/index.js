// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发环境（自动读取环境变量，需在云函数配置中设置正确的环境 ID）
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 动态获取当前环境（推荐）
  // 或固定环境 ID：env: '你的环境 ID'
});

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 查询 coupons 集合，按过期时间倒序排列（最新的在前）
    const res = await db.collection('coupons')
   
      .get(); // 获取所有文档
    
    return res.data; // 返回数据给前端
  } catch (error) {
    // 记录错误并返回空数组
    console.error('[数据库查询失败]', error);
    return [];
  }
};