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
      page: 'todos'
    }, {
      imgSrc: '../../images/movie.svg',
      page: 'movieList'
    }],
    defaultAvatar: '../../images/default_avatar.svg',
    dataLoaded: false,
    isNeedUpdate: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  onReady() {
    this.login()
  },
  handleGetUserInfo(res) {
    if (!res.detail.errMsg.includes('fail auth deny')) {
      this.updateUserInfo(res.detail.userInfo)
    }
  },
  login() {
    const self = this
    AV.User.loginWithWeapp().then(user => {
      const _user = user.toJSON()
      self.setData({
        userName: _user.nickName ? _user.nickName : '',
        avatar: _user.avatarUrl ? _user.avatarUrl : '',
        dataLoaded: true,
        isNeedUpdate: _user.nickName ? false : true
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
    });
  },
  updateUserInfo(userInfo) {
    const self = this
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    const user = AV.User.current();
    // 更新当前用户的信息
    user.set(userInfo).save().then(res => {
      console.log(res)
      const _res = res.toJSON()
      self.setData({
        userName: _res.nickName,
        avatar: _res.avatarUrl,
        isNeedUpdate: false
      })
      wx.hideLoading()
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 500
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  goPage(e) {
    const {
      page
    } = e.currentTarget.dataset
    const _url = `../${page}/${page}`
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