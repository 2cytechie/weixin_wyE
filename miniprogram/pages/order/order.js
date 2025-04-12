// pages/order/order.js
const db = wx.cloud.database()

Page({
  data: {
    is_popup:false,
    popup_type:'',
    selectedInfo: {
      service: '全部服务',
      status: '全部状态',
      location: '全部地点',
      gender: '全部性别'
    },
    optionLists: {
      service: ['全部服务','取外卖', '取快递', '食堂带饭','超市代买','代替服务','取奶咖','游戏开黑','更多帮助'],
      status: ['全部状态', '待接单', '待完成','已完成','已取消'],
      location: ['全部地点','地点1', '地点2', '地点3'],
      gender: ['全部性别','男', '女']
    },

    pageSize: 5, // 每页加载的数据数量
    currentPage: 1, // 当前页码
    hasMoreData: true, // 是否还有更多数据
    data_list: [
      {
        avatar: "/images/1.png",
        service: "取外卖",
        time: "17:46",
        status:"已完成",
        message: "test肯德基，聂女士，8604预计到校门时间:17：14备注:",
        pick_location: "亳州学院宿舍-8栋(*楼)-****",
        tip: 3,
        count:1,
        viewCount:0,
      },
      // 其他任务数据...
    ]
  },

  show_popup(e) {
    const type = e.currentTarget.dataset.type;
    console.log(type)
    if (!this.data.popup_type || type === this.data.popup_type) {
        this.setData({
            is_popup:!this.data.is_popup,
            popup_type: this.data.is_popup? '' : type 
        });
    } else {
        this.setData({
            is_popup: true,
            popup_type: type
        });
    }
},
  selectOption(e) {
    const value = e.currentTarget.dataset.value;
    const type = this.data.popup_type;
    const selectedInfo = this.data.selectedInfo;
    if (selectedInfo[type] === value) {
      selectedInfo[type] = '';
    } else {
      selectedInfo[type] = value;
    }
    this.setData({
      selectedInfo: selectedInfo
    });
  },
  resetOptions() {
    this.setData({
      selectedInfo: {
        service: '全部服务',
        status: '全部状态',
        location: '全部地点',
        gender: '全部性别'
      },
      is_popup: false
    });
  },
  confirmOptions() {
    let that = this;
    this.setData({
        is_popup: false,
        currentPage:1,
        hasMoreData:true,
        popup_type:'',
        data_list: []
    }, () => {
        that.loadData();
    });
},

  loadData: function () {
    const { pageSize, currentPage } = this.data;
    const skip = (currentPage - 1) * pageSize;

    // 构建查询条件
    let queryCondition = {};
    let _SelectedInfo = this.data.selectedInfo
    for(let key in _SelectedInfo){
      if(_SelectedInfo[key] != this.data.optionLists[key][0]){
        queryCondition[key] = this.data.selectedInfo[key];
      }
    }

    db.collection('takeout_data')
      .where(queryCondition)
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
            data_list: this.data.data_list.concat(newData),
            currentPage: currentPage + 1
        });
    })
    .catch(err => {
        console.error('数据加载失败', err);
        // 给用户显示加载失败的提示
        wx.showToast({
            title: '数据加载失败，请稍后重试',
            icon: 'none'
        });
    });
  },
  
  show_page(e) {
    const message = e.currentTarget.dataset.idx;
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

   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 页面加载时加载第一页数据
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
    
      // 确保 data_list 存在
      if (this.data_list) {
          this.data_list.forEach((order, index) => {
              const viewCount = wx.getStorageSync('order_view_count_' + order.idx);
              if (viewCount) {
                  this.data_list[index].viewCount = viewCount;
              }
          });
          this.setData({
              data_list: this.data_list
          });
      }
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})