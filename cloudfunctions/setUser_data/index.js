// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database() // 初始化数据库对象

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const phone = event.phone
  const update_data = event.update_data
  const data_type = event.type

  try {
    // 创建一个动态的更新对象
    const updateObj = {}
    updateObj[data_type] = update_data

    // 根据传入的 id 更新对应记录的点击量
    const res = await db.collection('user_data')
     .where({
        _openid: wxContext.OPENID,
        phone: phone
      })
     .update({
        data: updateObj
      })

    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      error:e
    }
  }
}