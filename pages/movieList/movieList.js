// pages/movieList/movieList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://api-m.mtime.cn/',//时光网Api
    locationID: '292',//上海
    listData: null,
    subUrl: 'Showtime/LocationMovies.api?'
    //PageSubArea/HotPlayMovies.api? //正在售票
    //Showtime/LocationMovies.api? //正在热映
    //Movie/MovieComingNew.api? //即将上映
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
    self.getMovieList(self.data.subUrl, self.data.locationID).then(res => {
      wx.hideLoading()
      console.log(res.data)
      self.setData({
        listData: res.data.ms
      })
    })
  },
  //跳转到电影详情页
  gotoDetailPage: function (e) {
    wx.navigateTo({
      url: `../movieDetail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  //获取电影列表
  getMovieList(url, location) {
    let self = this
    let _url = `${self.data.baseUrl}${url}locationId=${location}`
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