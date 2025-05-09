Page({
  data: {
    inviteCount: 0,
    hasHelped: false // 新增：记录用户是否已经助力过
  },
  onLoad: function() {
    // 从本地存储获取助力状态
    wx.getStorage({
      key: 'hasHelped',
      success: (res) => {
        this.setData({
          hasHelped: res.data
        }, () => {
          this.showModalBasedOnStatus();
        });
      },
      fail: (err) => {
        console.log('读取助力状态失败，使用默认值', err);
        this.showModalBasedOnStatus();
      }
    });
  },
  
  showModalBasedOnStatus: function() {
    const { hasHelped } = this.data;
    
    // 根据助力状态显示不同的模态框
    const config = hasHelped ? {
      modal: {
        title: '',
        content: '你已助力过该好友',
        confirmText: '我知道了',
        showCancel: false
      },
      tabBarPageUrl: '/pages/start/start'
    } : {
      modal: {
        title: '',
        content: '助力好友',
        confirmText: '确认助力',
        showCancel: false
      },
      tabBarPageUrl: '/pages/start/start'
    };

    wx.showModal({
      ...config.modal,
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击了确认');
          
          if (!hasHelped) {
            // 增加邀请人数（仅在未助力过时执行）
            this.setData({
              inviteCount: this.data.inviteCount + 1,
              hasHelped: true
            }, () => {
              console.log('邀请人数已更新为:', this.data.inviteCount);
              
              // 保存到本地存储
              wx.setStorage({
                key: 'inviteCount',
                data: this.data.inviteCount,
                success: () => {
                  console.log('邀请人数已保存到本地存储');
                }
              });
              
              // 保存助力状态到本地存储
              wx.setStorage({
                key: 'hasHelped',
                data: true,
                success: () => {
                  console.log('助力状态已保存到本地存储');
                }
              });
            });
          }
          
          // 跳转到目标页面（无论是否助力过都跳转）
          wx.switchTab({
            url: config.tabBarPageUrl,
            success: () => {
              console.log('成功跳转到 tabBar 页面');
            },
            fail: (err) => {
              console.error('跳转到 tabBar 页面失败:', err);
              wx.showToast({
                title: '跳转失败，请稍后重试',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: (err) => {
        console.error('模态框显示失败:', err);
        wx.showToast({
          title: '模态框显示失败，请稍后重试',
          icon: 'none'
        });
      }
    });
  },
  
  onShow: function() {
    // 从本地存储恢复邀请人数和助力状态
    wx.getStorage({
      key: 'inviteCount',
      success: (res) => {
        this.setData({
          inviteCount: res.data
        });
      },
      fail: (err) => {
        console.log('读取本地存储失败，使用默认值', err);
      }
    });
    
    wx.getStorage({
      key: 'hasHelped',
      success: (res) => {
        this.setData({
          hasHelped: res.data
        });
      },
      fail: (err) => {
        console.log('读取助力状态失败，使用默认值', err);
      }
    });
  }
});