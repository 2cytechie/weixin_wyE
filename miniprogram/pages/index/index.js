Page({
  data: {
    user_data:{
      avatar:"cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png",
      name:"小白",
      gender:"男",
      phone:"",
      login_time:"注册时间",
      is_orderer:false,
      make_orderer_time:"",
      is_promoter:false,
      make_promoter_time:"",
      send_orders:["发出的订单号"],
      pick_orders:["接单的订单号"],
      locations:["我的地址"],
      coupons:["优惠卷id"],
      cards:["卡号??????????????"],
      message:["我的消息"]
    },
    isNicknameModalShow: false, // 弹窗显示状态
    nicknameInput: '' // 输入框内容
  },

  // 打开弹窗
  showNicknameModal() {
    this.setData({
      isNicknameModalShow: true,
      nicknameInput: this.data.user_data.name // 初始化显示当前昵称（假设user_data在data中）
    });
  },

  // 关闭弹窗
  hideNicknameModal() {
    this.setData({
      isNicknameModalShow: false
    });
  },

  // 输入框内容变化
  onNicknameInput(e) {
    this.setData({
      nicknameInput: e.detail.value.trim()
    });
  },

  // 确定修改昵称
  confirmNicknameChange() {
    const newNickname = this.data.nicknameInput;
    // 简单校验（可根据需求扩展）
    if (!newNickname) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    if (newNickname.length > 8) {
      wx.showToast({ title: '昵称最多8个字', icon: 'none' });
      return;
    }

    // 模拟修改昵称逻辑（实际需调用接口或更新数据）
    this.setData({
      'user_data.name': newNickname, // 更新用户数据中的昵称
      isNicknameModalShow: false
    });
    wx.showToast({ title: '昵称修改成功' });
  }
});