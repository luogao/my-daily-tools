//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listData: [],
    listFilter: {
      isFinished: false
    },
    curLocation: null
  },
  //事件处理函数
  bindViewTap: function (e) {
    wx.navigateTo({
      url: `../details/details?id=${e.currentTarget.dataset.uid}`
    })
  },
  listFilterStatus(e) {
    let tempdata = !this.data.listFilter.isFinished
    this.setData({
      'listFilter.isFinished': tempdata
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
  getLocation() {
    let self = this
    wx.chooseLocation({
      success(res) {
        console.log(res.name)
        console.log(res.address)
        self.setData({
          curLocation: res.name
        })
      }
    })
  },
  getMovie() {
    let self = this
    wx.navigateTo({
      url: `../movieList/movieList`
    })
  },
  onUnload() {
  },
  setCurrentUser() {
    const user = AV.User.current();
    if (user) return true
    return false
  },
  createNew() {
    wx.navigateTo({
      url: '../details/details?id=-1'
    })
  }
})
