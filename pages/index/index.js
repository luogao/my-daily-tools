//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js');

Page({
  data: {
    listData: {
      finished: [],
      notFinished: []
    },
    currentPage: 0
  },
  //事件处理函数
  itemClickHandler: function(e) {
    wx.navigateTo({
      url: `../details/details?id=${e.detail.currentTarget.dataset.uid}`
    })
  },
  fetchData(cb) {
    wx.showLoading({
      title: '加载中 ...',
    })
    const fullData = wx.getStorageSync('todolist') || []
    const processedData = fullData.map(el => {
      el.createAt = util.formatTime(new Date(el.createAt))
      el.finishAt = el.finishAt ? util.formatTime(new Date(el.finishAt)) : null
      el.deadline = el.deadline ? el.deadline.replace(/-/g, '/') : null
      el.checked = false
      return el
    })
    processedData.reverse()
    this.setData({
      'listData.finished': this.finishedData(processedData.reverse()),
      'listData.notFinished': this.notFinishedData(processedData.reverse())
    })
    wx.hideLoading()
    if (typeof cb === "function") {
      cb()
    }
  },
  onReady() {
    this.fetchData()
  },
  onShow() {
    this.fetchData()
  },
  createNew() {
    wx.navigateTo({
      url: '../details/details?id=-1'
    })
  },
  finishedData(data) {
    console.log(data.filter(todo => todo.isFinished === true))
    return data.filter(todo => todo.isFinished === true)
  },
  notFinishedData(data) {
    console.log(data.filter(todo => !todo.isFinished === true))
    return data.filter(todo => !todo.isFinished === true)
  }
})