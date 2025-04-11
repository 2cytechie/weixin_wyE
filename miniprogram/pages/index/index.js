// pages/order/order.js
const db = wx.cloud.database()

Page({
    data: {
        is_popup: false,
        popup_type: '',
        selectedInfo: {
            service: '全部服务',
            status: '全部状态',
            location: '全部地点',
            gender: '全部性别'
        },
        optionLists: {
            service: ['全部服务', '取外卖', '取快递', '食堂带饭', '超市代买', '代替服务', '取奶咖', '游戏开黑', '更多帮助'],
            status: ['全部状态', '待接单', '待完成', '已完成', '已取消'],
            location: ['全部地点', '地点1', '地点2', '地点3'],
            gender: ['全部性别', '男', '女']
        },
        pageSize: 5,
        currentPage: 1,
        hasMoreData: true,
        data_list: [
            {
                avatar: "/images/1.png",
                service: "取外卖",
                time: "17:46",
                status: "已完成",
                message: "test肯德基，聂女士，8604预计到校门时间:17：14备注:",
                pick_location: "亳州学院宿舍-8栋(*楼)-****",
                tip: 3,
                count: 1,
                viewCount: 0
            }
        ]
    },

    show_popup(e) {
        const type = e.currentTarget.dataset.type;
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
            currentPage: 1,
            hasMoreData: true,
            popup_type: '',
            data_list: []
        }, () => {
            that.loadData();
        });
    },

    loadData: function () {
        const { pageSize, currentPage } = this.data;
        const skip = (currentPage - 1) * pageSize;

        let queryCondition = {};
        let _SelectedInfo = this.data.selectedInfo;
        for (let key in _SelectedInfo) {
            if (_SelectedInfo[key]!== this.data.optionLists[key][0]) {
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
                    this.setData({
                        hasMoreData: false
                    });
                }
                const processedData = newData.map(item => ({
                    ...item,
                    viewCount: item.viewCount || 0
                }));
                this.setData({
                    data_list: this.data.data_list.concat(processedData),
                    currentPage: currentPage + 1
                });
            })
           .catch(err => {
                console.error('数据加载失败', err);
                wx.showToast({
                    title: '数据加载失败，请稍后重试',
                    icon: 'none'
                });
            });
    },

    show_page(e) {
        const item = e.currentTarget.dataset.idx;
        const count = item.count;

        wx.setStorageSync('show_order_data', count);

        // 获取当前浏览次数
        let viewCount = wx.getStorageSync(`order_view_count_${count}`);
        if (!viewCount) {
            // 如果缓存中不存在该记录，初始化为 1
            viewCount = 1;
        } else {
            // 存在则次数加 1
            viewCount++;
        }
        // 将更新后的浏览次数存回缓存
        wx.setStorageSync(`order_view_count_${count}`, viewCount);

        // 更新页面上的浏览量显示
        const { data_list } = this.data;
        const targetOrderIndex = data_list.findIndex(order => order.count === count);
        if (targetOrderIndex!== -1) {
            data_list[targetOrderIndex].viewCount = viewCount;
            this.setData({
                data_list: data_list
            });
        }

        wx.navigateTo({
            url: `/pages/order_message/order_message?count=${count}`
        });
    },

    onReachBottom() {
        this.loadData();
    },

    onLoad(options) {
        this.loadData();

        const { data_list } = this.data;
        data_list.forEach((order, index) => {
            const viewCount = wx.getStorageSync(`order_view_count_${order.count}`);
            if (viewCount) {
                data_list[index].viewCount = parseInt(viewCount);
            }
        });
        this.setData({
            data_list: data_list
        });
    },

    onReady() {

    },

    onShow() {

    },

    onHide() {

    },

    onUnload() {

    },

    onPullDownRefresh() {

    },

    onShareAppMessage() {

    }
})    