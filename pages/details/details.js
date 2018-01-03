
const app = getApp()

Page({
  data: {
    deadline:'2018-01-03',
    status: false
  },
  onLoad: function () {
    console.log('detail')
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadline: e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  statusChange:function(e){
    console.log('switch发送选择改变，携带值为', e.detail.value)
    this.setData({
      status: e.detail.value
    })
  }
})