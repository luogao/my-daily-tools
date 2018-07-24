const app = getApp()
const AV = require('../../libs/av-weapp-min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userName: '',
    avatar: '',
    curLocation: '',
    tools: [{
      imgSrc: '../../images/todo.svg',
      page: 'index'
    }, {
      imgSrc: '../../images/movie.svg',
      page: 'movieList'
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
      this.setData({
        userName: user.toJSON().nickName,
        avatar: user.toJSON().avatarUrl
      })
      console.log(user)
      wx.hideLoading()
    }).catch(console.error);
    // if (user) {
    //   wx.getUserInfo({
    //     success: ({ userInfo }) => {
    //       // 更新当前用户的信息
    //       user.set(userInfo).save().then(user => {
    //         app.globalData.userInfo = user.toJSON();
    //         self.setData({
    //           userName: app.globalData.userInfo.nickName,
    //           avatar: app.globalData.userInfo.avatarUrl
    //         })
    //         wx.hideLoading()
    //       }).catch(console.error);
    //     }
    //   })
    // }
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
  goPage(e) {
    console.log(e)
    const { page } = e.currentTarget.dataset
    const _url = `../${page}/${page}`
    console.log(_url)
    wx.navigateTo({
      url: _url
    })
  },
  getCurLocation() {
    const self = this
    wx.chooseLocation({
      success(res) {
        if (res.name) {
          self.setData({
            curLocation: res
          })
        } else {
          wx.showToast({
            title: '获取地址失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  clearCurLoction() {
    this.setData({
      curLocation: ''
    })
  }
})