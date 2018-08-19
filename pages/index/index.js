//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js');

Page({
  data: {
    listData: [],
    curLocation: null,
    currentPage: 0
  },
  //事件处理函数
  itemClickHandler: function(e) {
    wx.navigateTo({
      url: `../details/details?id=${e.detail.currentTarget.dataset.uid}`
    })
  },
  fetchData(cb) {
    const fullData = wx.getStorageSync('todolist') || []
    const processedData = fullData.map(el => {
      el.createAt = util.formatTime(new Date(el.createAt))
      el.finishAt = el.finishAt ? util.formatTime(new Date(el.finishAt)) : null
      el.deadline = el.deadline ? el.deadline.replace(/-/g, '/') : null
      el.checked = false
      return el
    })
    this.setData({
      listData: processedData.reverse()
    })
    wx.hideLoading()
    if (typeof cb === "function") {
      cb()
    }
  },
  // onPullDownRefresh() {
  //   let self = this 
  //   wx.showNavigationBarLoading()
  //   util.Store.fetch((data) => {
  //     let fullData = data.data
  //     fullData.forEach(el => {
  //       el.createAt = util.formatTime(new Date(el.createAt))
  //       el.deadline = el.deadline ? el.deadline.replace(/-/g, '/') : null
  //     })
  //     self.setData({
  //       listData: fullData
  //     })
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   })
  // },
  onReady() {
    wx.showLoading({
      title: '加载中...'
    })
    this.fetchData()
  },
  onShow() {
    wx.showLoading({
      title: '加载中...'
    })
    this.fetchData()
  },
  onUnload() {},
  createNew() {
    wx.navigateTo({
      url: '../details/details?id=-1'
    })
  }
})