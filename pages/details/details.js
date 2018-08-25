const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
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
      createAt: null,
      finishAt: null
    },
    editValue: {
      title: null,
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
    wx.showLoading({
      title: "加载中...",
      mask: true,
    })
    this.initData(option.id)
    this.setData({
      today: this.getToday()
    })
  },
  initData(id) {
    let self = this
    if (id != -1) {
      util.Store.fetch(function (data) {
        self.setData({
          fullData: data.data,
          curId: id
        })
        wx.hideLoading()
        let index = self.data.fullData.findIndex(el => el.uId == self.data.curId)
        let curData = self.data.fullData[index]
        self.setData({
          itemValue: curData
        })
      })
    } else {
      wx.hideLoading()
      let tempData = wx.getStorageSync('todolist') || []
      self.setData({
        fullData: tempData,
        curId: id
      })
    }
  },
  editItem(key, data) {
    let self = this
    if (self.data.itemValue[key] === data || self.data.editValue[key] === data) {
      return
    } else {
      let tempFullData = this.data.fullData.slice()
      let index = tempFullData.findIndex(el => el.uId == self.data.curId)
      if (self.data.curId != -1 && self.data.curId) {
        tempFullData[index][key] = data
        wx.showLoading({
          title: "编辑中...",
          mask: true,
        })
        util.Store.save(tempFullData, function () {
          util.Store.fetch(function (data) {
            wx.hideToast()
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 1000
            })
          })
        })
      }
    }
  },
  //时间更改，保存、修改
  bindDateChange: function (e) {
    this.editItem("deadline", e.detail.value)
    this.setData({
      "itemValue.deadline": e.detail.value
    })
  },
  //完成状态修改
  statusChange: function (e) {
    this.editItem("isFinished", e.detail.value)
    if (e.detail.value) {
      this.editItem("finishAt", Date.now())
    }
    this.setData({
      "itemValue.isFinished": e.detail.value
    })
  },
  // Title绑定失焦事件 保存/编辑
  bindTitleBlur: function (e) {
    this.editItem("title", e.detail.value)
    this.setData({
      "itemValue.title": e.detail.value,
      "editValue.title": null
    })
  },
  // Remark绑定失焦事件 保存/编辑
  bindTextAreaBlur: function (e) {
    this.editItem("remarks", e.detail.value)
    this.setData({
      "itemValue.remarks": e.detail.value,
      "editValue.remarks": null
    })
  },
  //Title点击text元素开始出现表单元素开始编辑
  editItemTitle: function (e) {
    this.setData({
      "editValue.title": this.data.itemValue.title,
      "itemValue.title": null,
      titleFormFocus: true
    })
  },
  //Remark点击text元素开始出现表单元素开始编辑
  editItemRemarks: function (e) {
    this.setData({
      "editValue.remarks": this.data.itemValue.remarks,
      "itemValue.remarks": null,
      remarksFormFocus: true
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
        wx.hideLoading()
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        tempData = null
      })
    })
  },
  deleteItem() {
    let self = this
    wx.showModal({
      title: '此操作将无法撤回',
      content: '请确认是否继续！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: "删除中...",
            mask: true,
          })
          let tempFullData = self.data.fullData.slice()
          let index = tempFullData.findIndex(el => el.uId == self.data.curId)
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
              wx.hideLoading()
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 300,
                success() {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 300)
                }
              })
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
})