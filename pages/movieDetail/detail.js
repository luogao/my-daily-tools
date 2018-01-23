// pages/movieDetail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://ticket-api-m.mtime.cn/',
    locationID: '292',
    detailData: null,
    subUrl1: 'movie/detail.api?'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.showLoading({
      title: "加载中...",
      mask: true,
    })
    self.getMovieData(self.data.subUrl1, self.data.locationID, options.id).then(res => {
      wx.hideLoading()
      console.log(res.data)
      self.setData({
        detailData: res
      })
    }).catch((err)=>{
      wx.hideLoading()
      wx.showToast({
        title: '出错啦！',
        icon: 'loading',
        duration: 500,
        success:function(){
          
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