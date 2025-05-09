// pages/order/order.js
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    currentTab: 0,
    tabList: [
      { title: '全部' },
      { title: '待支付' },
      { title: '待接单' },
      { title: '待完成' },
      { title: '已完成' }
    ],
    all_data:[],
    data_list:[]
  },

  // 标签点击切换
  switchTab(e) {
    const current = e.currentTarget.dataset.index
    this.setData({ currentTab: current },()=>{
      this.filterOrders();
    })
  },

  // 滑动切换
  handleSwiperChange(e) {
    this.setData({ currentTab: e.detail.current },()=>{
      this.filterOrders();
    })
  },

  onPullDownRefresh() {
    this.onReady()
  },

  // 筛选订单
  filterOrders() {
    const { currentTab, all_data } = this.data;
    const statusMap = ['全部', '待支付', '待接单', '待完成', '已完成'];
    const currentStatus = statusMap[currentTab];
    
    let filtered;
    if (currentStatus === '全部') {
      filtered = all_data;
    } else {
      filtered = all_data.filter(order => order.status === currentStatus);
    }
    
    this.setData({
      data_list: filtered
    });

  },
  show_page(e) {
    const message = e.currentTarget.dataset.idx;
    console.log("电话",message.phone)
    message.phone = this.formatPhone(message.phone)
    // 增加点击量
    wx.cloud.callFunction({
      name: 'viewCount',
      data: {
        id:message._id
      }
    })
    let new_data_list = [];
    for (let item of this.data.data_list) {
        if (item._id === message._id) {
            const newItem = {
                ...item,
                viewCount: item.viewCount ? item.viewCount + 1 : 1
            };
            new_data_list.push(newItem);
        } else {
            new_data_list.push(item);
        }
    }
    // 更新页面数据
    this.setData({
        data_list: new_data_list
    });

    wx.setStorageSync('show_order_data', message);
    wx.navigateTo({
        url: '/pages/order_message/order_message',
    });
},
// 电话号码脱敏函数
formatPhone(phone) {
  // 转为字符串（处理可能的数字类型输入）
  phone = phone.toString();
  // 检查长度（至少保留前3后2，需至少5位）
  if (phone.length < 5) return phone; // 长度不足时直接返回
  // 前3位 + 中间星号 + 后2位
  return phone.slice(0, 3) + '*'.repeat(phone.length - 5) + phone.slice(-2);
},

  onReady() {
    const SendOrders = wx.getStorageSync('user_data').send_orders;
    // 从takeout_data中请求数据
    db.collection("takeout_data")
    .where({
      outTradeNo: _.in(SendOrders) // 使用 .in 操作符查询多个订单号
    })
    .get()
    .then(res=>{
      this.setData({
        all_data:res.data,
        data_list:res.data
      })
    })
    
  },
})