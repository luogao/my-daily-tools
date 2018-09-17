//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const AV = require('../../libs/av-weapp-min.js')

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
    console.log(e.detail.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../todoDetails/todoDetails?id=${e.detail.currentTarget.dataset.id}`
    })
  },
  fetchData(cb) {
    wx.showLoading({
      title: '加载中 ...',
    })
    const query = new AV.Query('Todo')
      .equalTo('user', AV.User.current())
      .descending('createdAt')
      .find()
    query.then((data) => {
      this.setTodos(data)
    }).catch(console.error)
    wx.hideLoading()
  },
  setTodos(todos) {
    const fullData = todos.slice() || []
    const processedData = fullData.map(el => {
      const _el = el.toJSON()
      _el.createdTime = util.formatTime(new Date(_el.createdAt))
      _el.finishAt = _el.finishAt ? util.formatTime(new Date(_el.finishAt)) : ''
      _el.deadline = _el.deadline ? _el.deadline.replace(/-/g, '/') : ''
      _el.checked = false
      return _el
    })
    console.log(processedData)
    this.setData({
      'listData.finished': this.finishedData(processedData),
      'listData.notFinished': this.notFinishedData(processedData)
    })
  },
  onReady() {
    this.fetchData()
  },
  onShow() {
    this.fetchData()
  },
  createNew() {
    wx.navigateTo({
      url: '../todoDetails/todoDetails?id=-1'
    })
  },
  finishedData(data) {
    return data.filter(todo => todo.isFinished === true)
  },
  notFinishedData(data) {
    return data.filter(todo => !todo.isFinished === true)
  }
})