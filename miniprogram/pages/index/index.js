Page({
  data: {
    dataList: ['111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000',
    '111111','2222222','3333333','444444','5555555','6666666','77777','8888','9999','0000'
  ], // 存储页面数据
    pageSize: 10, // 每页加载的数据数量
    currentPage: 1, // 当前页码
    hasMoreData: true // 是否还有更多数据
  },

  onLoad: function () {
    // 页面加载时加载第一页数据
    this.loadData();
  },

  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    if (this.data.hasMoreData) {
      this.loadData();
    }
  },

  loadData: function () {
    const { pageSize, currentPage } = this.data;
    const skip = (currentPage - 1) * pageSize;

    wx.cloud.database().collection('your-collection-name')
      .skip(skip)
      .limit(pageSize)
      .get()
      .then(res => {
        const newData = res.data;
        if (newData.length < pageSize) {
          // 如果返回的数据数量小于每页加载的数量，说明没有更多数据了
          this.setData({
            hasMoreData: false
          });
        }
        this.setData({
          dataList: this.data.dataList.concat(newData),
          currentPage: currentPage + 1
        });
      })
      .catch(err => {
        console.error('数据加载失败', err);
      });
  }
});