const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    deadline: '2018-01-03',
    status: false,
    today: null,
    curId: null,
    fullData: null,
    remarksFormFocus: false,
    titleFormFocus: false,
    itemValue: {
      title: null,
      deadline: null,
      isFinished: false,
      remarks: null,
      uId: null,
      createAt: null
    },
    editValue: {
      title: null,
      deadline: null,
      isFinished: false,
      remarks: null,
    }
  },
  getToday() {
    let date = new Date()
    let d = date.getDate()
    let m = date.getMonth()
    let y = date.getFullYear()
    let todayStr = `${y}-${(m + 1) > 10 ? m + 1 : `0${m + 1}`}-${d > 10 ? d : `0${d}`}`
    return todayStr
  },
  onLoad: function (option) {
    let self = this
    if (option.id != -1) {
      console.log('edit')
      wx.showLoading({
        title: "加载中...",
        mask: true,
      })
      util.Store.fetch(function (data) {
        self.setData({
          fullData: data.data,
          curId: option.id
        })
        wx.hideLoading()
        let index = self.data.fullData.findIndex(el => el.uId == self.data.curId)
        let curData = self.data.fullData[index]
        self.setData({
          itemValue: curData
        })
        console.log(self.data.fullData)
        console.log(self.data.itemValue)
      })
    } else {
      let tempData = wx.getStorageSync('todolist') || []
      self.setData({
        fullData: tempData,
        curId: option.id
      })
      console.log(self.data.fullData, self.data.curId)
    }
    this.setData({
      today: this.getToday()
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      "itemValue.deadline": e.detail.value
    })
  },

  statusChange: function (e) {
    console.log('switch发送选择改变，携带值为', e.detail.value)
    this.setData({
      "itemValue.isFinished": e.detail.value
    })
  },
  editItemTitle: function (e) {
    this.setData({
      "editValue.title": this.data.itemValue.title,
      "itemValue.title": null,
      titleFormFocus: true
    })
  },
  bindTitleBlur: function (e) {
    this.setData({
      "itemValue.title": e.detail.value,
      "editValue.title": null
    })
  },
  editItemRemarks: function (e) {
    this.setData({
      "editValue.remarks": this.data.itemValue.remarks,
      "itemValue.remarks": null,
      remarksFormFocus: true
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      "itemValue.remarks": e.detail.value,
      "editValue.remarks": null
    })
  },
  saveItem() {
    let self = this
    let tempData = this.data.itemValue
    let tempFullData = this.data.fullData.slice()
    wx.showLoading({
      title: "保存中...",
      mask: true,
    })
    if (self.data.curId == -1) {
      tempData.uId = this.data.fullData.length === 0 ? 0 : this.data.fullData[this.data.fullData.length - 1].uId + 1
      tempData.createAt = Date.now()
      tempFullData.push(tempData)
      console.log(tempData)
      util.Store.save(tempFullData, function () {
        util.Store.fetch(function (data) {
          self.setData({
            fullData: data.data,
            curId: tempData.uId,
            itemValue: tempData
          })
          wx.hideToast()
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
          tempData = null
        })
      })
    } else {

    }
  },
  deleteItem() {
    let self = this
    wx.showLoading({
      title: "删除中...",
      mask: true,
    })
    let tempFullData = this.data.fullData.slice()
    let index = tempFullData.findIndex(el => el.uId == self.data.curId)
    console.log(index)
    tempFullData.splice(index, 1)
    util.Store.save(tempFullData, function () {
      util.Store.fetch(function (data) {
        self.setData({
          fullData: data.data,
          curId: -1,
          itemValue: {
            title: null,
            deadline: null,
            isFinished: false,
            remarks: null,
            uId: null,
            createAt: null
          }
        })
        wx.hideToast()
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 1000
        })
      })
    })
  }
})