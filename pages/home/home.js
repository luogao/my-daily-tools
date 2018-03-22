const app = getApp()
const AV = require('../../libs/av-weapp-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    avatar: '',
    tools: [{
      imgSrc: '../../images/todo.svg',
      url:''
    }, {
      imgSrc: '../../images/location.svg'
    }, {
      imgSrc: '../../images/movie.svg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    const user = AV.User.current();
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    AV.User.loginWithWeapp().then(user => {
      app.globalData.userInfo = user.toJSON();
      console.log(user)
    }).catch(console.error);

    if (user) {
      wx.getUserInfo({
        success: ({ userInfo }) => {
          // 更新当前用户的信息
          user.set(userInfo).save().then(user => {
            app.globalData.userInfo = user.toJSON();
            self.setData({
              userName: app.globalData.userInfo.nickName,
              avatar: app.globalData.userInfo.avatarUrl
            })
            wx.hideLoading()
          }).catch(console.error);
        }
      })
    }
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

  },
  goPage(url){
    const _url = `../${url}/${url}`
    wx.navigateTo({
      url: _url
    })
  }
})