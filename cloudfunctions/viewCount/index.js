// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const { id } = event;
    try {
        // 根据传入的 id 更新对应记录的点击量
        const res = await db.collection('takeout_data')
           .where({
                _id: id
            })
           .update({
                data: {
                    viewCount: _.inc(1) // 点击量加 1
                }
            });
        return {
            success: true
        };
    } catch (e) {
        return {
            success: false
        };
    }
};