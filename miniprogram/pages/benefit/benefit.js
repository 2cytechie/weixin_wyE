const db = wx.cloud.database();
const app = getApp()
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
          { title: '红包1', tip: '无门槛使用', money: '5元', condition: '10', integral: 50 },
          { title: '红包2', tip: '线上消费可用', money: '10元', condition: '20', integral: 100 },
          { title: '红包2', tip: '线上消费可用', money: '20元', condition: '20', integral: 200 }
        
          
      ]
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
            icon: 'success'
        });
    }
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
            amount:"1",
            condition:"3"
            }
          })
          wx.showToast({
              title: '兑换成功！',
              icon: 'success'
          });
      }
  }
});
