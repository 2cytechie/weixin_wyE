const db = wx.cloud.database();
const app = getApp();
// 获取当前时间
const now = new Date();
// 计算五天的毫秒数
const twoDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;
// 在当前时间的基础上加上两天的毫秒数
const newDate = new Date(now.getTime() + twoDaysInMilliseconds);
// 将新的日期转换为本地字符串格式
const uploadTime = newDate.toLocaleString();

console.log('当前时间:', now.toLocaleString());
console.log('增加两天后的时间:', uploadTime);
Page({
  data: {
      points: 0,
      signedDays: 0,
      extraSignChance: 1,
      continuousSignDays: 0,
      weekDays: [
          { day: '周一', signed: false, needbuqian: false },
          { day: '周二', signed: false, needbuqian: false },
          { day: '周三', signed: false, needbuqian: false },
          { day: '周四', signed: false, needbuqian: false },
          { day: '周五', signed: false, needbuqian: false },
          { day: '周六', signed: false, needbuqian: false },
          { day: '周日', signed: false, needbuqian: false }
      ],
      exchangeList: [
          { title: '红包', tip: '适用于所有服务', money: '5元', condition: '10', integral: 50 },
          { title: '红包', tip: '适用于所有服务', money: '5元', condition: '10', integral: 50 },
          { title: '红包', tip: '适用于所有服务', money: '5元', condition: '10', integral: 50 }
      ]
  },
  onLoad() {
      // 页面加载时读取存储的签到数据
      const storageData = wx.getStorageSync('signData');
      if (storageData) {
          // 检查是否需要在周一重置签到状态
          this.checkAndResetWeeklySign(storageData);
      }
  },
  
  // 检查并在周一时重置本周签到状态
  checkAndResetWeeklySign(storageData) {
      const today = new Date().getDay();
      // 0表示周日，1表示周一
      if (today === 1) { // 如果今天是周一
          // 获取上次保存的日期
          const lastSavedDate = new Date(storageData.lastSavedTime || 0);
          const lastSavedDay = lastSavedDate.getDay();
          
          // 如果上次保存不是周一，说明需要重置本周签到
          if (lastSavedDay!== 1) {
              // 保留积分，重置本周签到状态
              const newWeekDays = storageData.weekDays.map(day => ({
                  ...day,
                  signed: false,
                  needbuqian: false
              }));
              
              // 更新数据
              this.setData({
                  ...storageData,
                  weekDays: newWeekDays,
                  signedDays: 0,
                  continuousSignDays: 0,
                  lastSavedTime: Date.now()
              });
              
              // 保存更新后的数据
              wx.setStorageSync('signData', this.data);
              
              wx.showToast({
                  title: '新的一周开始了，签到状态已重置！',
                  icon: 'success'
              });
              return;
          }
      }
      
      // 正常加载存储的数据
      this.setData({
          ...storageData,
          lastSavedTime: Date.now()
      });
  },

  signIn(e) {
      const index = e.currentTarget.dataset.index;
      const weekDays = this.data.weekDays;
      // 获取当前日期是星期几，0 表示周日，1 - 6 表示周一到周六
      const today = new Date().getDay();
      const todayIndex = today === 0? 6 : today - 1;

      if (index!== todayIndex) {
          wx.showToast({
              title: '等待当天再来签到吧！',
              icon: 'none'
          });
          return;
      }

      if (weekDays[index].signed) {
          wx.showToast({
              title: '今天已经签到过了，不能重复签到！',
              icon: 'none'
          });
          return;
      }

      weekDays[index].signed = true;
      this.setData({
          weekDays,
          points: this.data.points + 10,
          signedDays: this.data.signedDays + 1,
          continuousSignDays: this.data.continuousSignDays + 1,
          lastSavedTime: Date.now()
      });
      if (this.data.continuousSignDays === 7) {
          // 连续签到七天奖励逻辑
          this.setData({
              points: this.data.points + 50
          });
          wx.showToast({
              title: '连续签到七天，获得50积分奖励！',
              icon:'success'
          });
      }
      // 签到成功后保存签到数据
      wx.setStorageSync('signData', this.data);
  },

  exchange(e) {
      const index = e.currentTarget.dataset.index;
      const exchangeList = this.data.exchangeList;
      if (this.data.points >= exchangeList[index].integral) {
          this.setData({
              points: this.data.points - exchangeList[index].integral,
              lastSavedTime: Date.now()
          });
          db.collection("coupons").add({
            data:{
            name:"红包",  
            amount:"5",
            expireTime:uploadTime,
            condition:"10"
            }
          })
          wx.showToast({
              title: '兑换成功！',
              icon: 'success'
          });
          
          // 保存更新后的数据
          wx.setStorageSync('signData', this.data);
      }
  }
});