Page({
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    this.getOpenerEventChannel().on('sendData', (data) => {
      console.log('收到数据:', data)
    })
  }
})