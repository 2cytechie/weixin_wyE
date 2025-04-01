// js
Page({
  data: {
    weekDays: [
      { day: '周一', need补签: true },
      { day: '周二' },
      { day: '周三' },
      { day: '周四' },
      { day: '周五' },
      { day: '周六' },
      { day: '周日' }
    ],
    exchangeList: [
      {
        title: '跑腿券',
        tip: '有效期1天',
        money: '1元',
        condition: 3,
        integral: 3
      },
      {
        title: '满5减3券',
        tip: '有效期7天',
        money: '3元',
        condition: 5,
        integral: 5
      },
      {
        title: '代替券',
        tip: '有效期1天',
        money: '3元',
        condition: 10,
        integral: 10
      }
    ]
  }
})