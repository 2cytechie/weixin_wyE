// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNicknameModalShow: false, // 昵称弹窗显示状态
    showModal: false,

    avatar:"/images/用户.png",
    name:"",
    user_data:{}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const UserData = wx.getStorageSync('user_data');
    this.setData({user_data:UserData})
    if(!UserData.phone){
      wx.showModal({
        title: '你还没有授权登录哟！',
        content: '去登录',
        complete: (res) => {
          if (res.cancel) {
            
          }
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
    else{
      // 已经登录加载头像等资源
      this.setData({avatar:UserData.avatar})

      // if(UserData.avatar === "cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png"){
      // console.log("不用下载头像")  
      // return;
      // }
      // if(this.data.avatar === "/images/用户.png"){
      //   const that = this
      //   wx.cloud.downloadFile({
      //     fileID: UserData.avatar, // 单个fileID
      //     success (res) {
      //       that.setData({
      //         avatar:res.tempFilePath
      //       })
      //       console.log("avatar下载成功")
      //     },
      //     fail: error => {
      //       console.log(UserData.avatar)
      //       console.error('avatarr图片下载失败', error);
      //     }
      //   })
      // }
    }
  },
  selectAvatar(){
    this.chooseImage()
  },
  selectName(){
    this.showNicknameModal()
  },
  selectgender(){
    this.showGenderModal()
  },
  chooseImage() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType:["image"],
      sourceType: ['album', 'camera'],
      success: res => {
        // 上传头像
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const cloudPath = `avatar/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`; // 生成唯一的云存储路径
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: tempFilePath,
            success: uploadRes => {
              if(this.data.user_data.avatar !== "cloud://cloud1-1gm8k64i003f436e.636c-cloud1-1gm8k64i003f436e-1355812926/avatar/默认头像.png"){
                // 上传后删除原有头像
                const file = this.data.user_data.avatar
                wx.cloud.deleteFile({
                  fileList: [file],
                  success:res=>{
                    console.log("头像删除成功",file)
                  },
                  fail:res=>{
                    console.error("头像删除失败",file)
                  }
                })
              }
              const fileID = uploadRes.fileID;
              that.setData({
                "user_data.avatar":fileID,
                "avatar":tempFilePath
              })
              wx.setStorageSync('user_data', that.data.user_data)
              const SendOrders = this.data.user_data.send_orders;
              SendOrders.forEach((orderNo)=>{
                wx.cloud.database().collection("takeout_data").where({
                  outTradeNo:orderNo
                }).update({
                  data:{
                    avatar:fileID
                  }
                })
              })
              app.update_user_data("avatar",fileID)
            },
            fail: err => {
                console.error('图片上传失败:', err);
            }
        });
    },
    fail(err) {
      console.error('选择图片失败:', err);
      wx.showToast({
          title: '选择图片失败',
          icon: 'none'
      });
    },
    cancel(res){
      console.log("取消选择头像图片")
    }
    });
  },

  showNicknameModal() {
    this.setData({
      isNicknameModalShow: true,
      nicknameInput: this.data.user_data.name
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
    wx.setStorageSync('user_data', this.data.user_data)
    app.update_user_data("name",newNickname)
    wx.showToast({ title: '昵称修改成功' });
  },
  // 显示性别选择弹窗
  showGenderModal() {
    this.setData({
      showModal: true
    });
  },
  // 隐藏性别选择弹窗
  hideGenderModal() {
    this.setData({
      showModal: false
    });
  },
  // 选择性别
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      "user_data.gender": gender,
      showModal: false
    });
    wx.setStorageSync('user_data', this.data.user_data)
    app.update_user_data("gender",gender)
  },
})