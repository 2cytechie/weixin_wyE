// js
Page({
  data:{
    takeout_data:{
      name:"",
      phone:""
    }
  },
  set_message_data(e) {
    const takeoutType = e.currentTarget.dataset.takeout_type;
    const value = e.detail.value;
    const dataToUpdate = {};
    dataToUpdate[`takeout_data.${takeoutType}`] = value;
    this.setData(dataToUpdate);
    console.log(this.data.takeout_data)
  },

  submitApply() {
    // 这里添加提交逻辑，如表单验证、接口调用等
    console.log('提交申请');
  }
})