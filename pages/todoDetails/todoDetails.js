const app = getApp()
const util = require('../../utils/util.js')
const Todo = require('../../model/todos.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    status: false,
    today: null,
    curId: null,
    fullData: null,
    remarksFormFocus: false,
    titleFormFocus: false,
    itemValue: {
      title: '',
      deadline: '',
      isFinished: false,
      remarks: '',
      finishAt: 0
    },
    editValue: {
      title: null,
      remarks: null,
    },
    originalItem: null
  },
  getToday() {
    let date = new Date()
    let d = date.getDate()
    let m = date.getMonth()
    let y = date.getFullYear()
    let todayStr = `${y}-${(m + 1) > 10 ? m + 1 : `0${m + 1}`}-${d > 10 ? d : `0${d}`}`
    return todayStr
  },
  onLoad: function(option) {
    if (option.id) {
      wx.showLoading({
        title: "加载中...",
        mask: true,
      })
      this.initData(option.id)
    }
    this.setData({
      today: this.getToday()
    })
  },
  initData(id) {
    let self = this
    if (id) {
      self.fetchData(id)
      self.setData({
        curId: id
      })
    }
  },
  fetchData(id) {
    const self = this
    const query = new AV.Query('Todo')
    query.get(id).then(res => {
      const data = res.toJSON()
      wx.hideLoading()
      self.setData({
        itemValue: data,
        originalItem: res
      })
    })
  },
  editItem(key, data) {
    let self = this
    if (!self.data.curId) return;
    if (self.data.itemValue[key] === data || self.data.editValue[key] === data) {
      return
    } else {
      wx.showLoading({
        title: "编辑中...",
        mask: true,
      })
      self.data.originalItem.set(key, data).save().then(res => {
        wx.hideLoading()
        app.changeTodoUpdateState(true)
        wx.showToast({
          title: '编辑成功',
          icon: 'success',
          duration: 1000
        })
      })
    }
  },
  //时间更改，保存、修改
  bindDateChange: function(e) {
    this.editItem("deadline", e.detail.value)
    this.setData({
      "itemValue.deadline": e.detail.value
    })
  },
  //完成状态修改
  statusChange: function(e) {
    this.editItem("isFinished", e.detail.value)
    if (e.detail.value) {
      this.editItem("finishAt", Date.now())
    }
    this.setData({
      "itemValue.isFinished": e.detail.value
    })
  },
  // Title绑定失焦事件 保存/编辑
  bindTitleBlur: function(e) {
    this.editItem("title", e.detail.value)
    this.setData({
      "itemValue.title": e.detail.value,
      "editValue.title": ''
    })
  },
  // Remark绑定失焦事件 保存/编辑
  bindTextAreaBlur: function(e) {
    this.editItem("remarks", e.detail.value)
    this.setData({
      "itemValue.remarks": e.detail.value,
      "editValue.remarks": ''
    })
  },
  //Title点击text元素开始出现表单元素开始编辑
  editItemTitle: function(e) {
    this.setData({
      "editValue.title": this.data.itemValue.title,
      titleFormFocus: true
    })
  },
  //Remark点击text元素开始出现表单元素开始编辑
  editItemRemarks: function(e) {
    this.setData({
      "editValue.remarks": this.data.itemValue.remarks,
      remarksFormFocus: true
    })
  },
  saveItem() {
    let self = this
    let tempData = this.data.itemValue
    if (!tempData.title) return
    wx.showLoading({
      title: "保存中...",
      mask: true,
    })
    new Todo({
      ...tempData,
      user: AV.User.current()
    }).save().then(todo => {
      self.setData({
        curId: todo.id,
        itemValue: tempData,
        originalItem: todo
      })
      app.changeTodoUpdateState(true)
      wx.hideLoading()
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })
    }).catch(console.log)
  },
  deleteItem() {
    let self = this
    wx.showModal({
      title: '此操作将无法撤回',
      content: '请确认是否继续！',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: "删除中...",
            mask: true,
          })
          self.handleDelete(self.data.itemValue.objectId)
        } else if (res.cancel) {}
      }
    })
  },
  handleDelete(id) {
    console.log(id)
    AV.Query.doCloudQuery(`delete from Todo where objectId="${id}"`).then(function() {
      // 删除成功
      app.changeTodoUpdateState(true)
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
    }).catch(function(error) {
      // 异常处理
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 1000
      })
    });
  },
})