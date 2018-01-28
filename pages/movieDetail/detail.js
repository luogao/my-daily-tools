// pages/movieDetail/detail.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://ticket-api-m.mtime.cn/',
    locationID: '292',
    detailData: null,
    subUrl1: 'movie/detail.api?',
    showDate: null,
    subUrl2: 'movie/hotComment.api?',
    moiveComment: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000',
      animation: {
        duration: 300,
        timingFunc: 'easeIn'
      }
    })
    wx.showLoading({
      title: "加载中...",
      mask: true,
    })
    self.getMovieData(self.data.subUrl1, self.data.locationID,
      options.id).then(res => {
        wx.hideLoading()
        console.table(res.data.data.basic.commentSpecial)
        let _showTime = new Date(res.data.data.basic.showDay * 1000)
        console.log(res.data.data.basic)
        wx.setNavigationBarTitle({
          title: res.data.data.basic.name
        })
        self.setData({
          detailData: res.data.data,
          showDate: util.formatTime(_showTime)
        })
      }).then(() => {
        self.getMovieComment(self.data.subUrl2, options.id).then((res2) => {
          console.log(res2.data.data.mini.list)
          self.setData({
            moiveComment: res2.data.data.mini.list
          })
        })
      }).catch((err) => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '出错啦！',
          icon: 'loading',
          duration: 500,
          success: function () {

          }
        })
      })
  },
  getMovieData(url, location, movieID) {
    let self = this
    let _url = `${self.data.baseUrl}${url}locationId=${location}&movieId=${movieID}`
    return new Promise((resolve, reject) => {
      wx.request({
        url: _url,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  getMovieComment(url, movieID) {
    let self = this
    let _url = `${self.data.baseUrl}${url}&movieId=${movieID}`
    return new Promise((resolve, reject) => {
      wx.request({
        url: _url,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})