const db = wx.cloud.database();
const app = getApp();
// 获取当前时间
const now = new Date();
// 计算两天的毫秒数
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
          this.setData(storageData);
      }
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
          continuousSignDays: this.data.continuousSignDays + 1
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
              points: this.data.points - exchangeList[index].integral
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
      }
  }
});
