//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listData: [],
    listFilter: {
      isFinished: false
    },
    curLocation:null
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
    let fullData = wx.getStorageSync('todolist') || []
    let processedData = fullData.map(el => {
      el.createAt = util.formatTime(new Date(el.createAt))
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
  onShow() {
    this.fetchData()
  },
  getLocation(){
    let self = this
    wx.chooseLocation({
      success(res){
        console.log(res.name)
        console.log(res.address)
        self.setData({
          curLocation: res.name
        })
      }
    })
  },
  onUnload() {
  },
  onLoad: function () {
    
    wx.showLoading({
      title: "加载中...",
      mask: true,
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  createNew() {
    wx.navigateTo({
      url: '../details/details?id=-1'
    })
  }
})
