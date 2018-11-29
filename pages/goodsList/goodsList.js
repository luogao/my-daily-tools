// pages/goodsList/goodsList.js
const dayjs = require('dayjs')
const AV = require('../../libs/av-weapp-min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLoaded: false,
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.fetchData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  fetchData(cb) {
    wx.showLoading({
      title: '加载中 ...',
    })
    const query = new AV.Query('Goods')
      .equalTo('user', AV.User.current())
      .descending('createdAt')
      .find()
      .then((data) => {
        this.setTodos(data)
        typeof cb === 'function' && cb()
        this.setData({
          dataLoaded: true
        })
        wx.hideLoading()
      }).catch((err) => {
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          title: 'Load fail',
        })
      })
  },
  setTodos(data) {
    console.log(data)
    const fullData = data.slice() || []
    const processedData = fullData.map(el => {
      const _el = el.toJSON()
      console.log(_el)
      return this.processData(_el)
    }).sort(this._sort)
    this.setData({
      'listData': processedData,
    })
  },
  _sort(before, after) {
    return before.dayLeft - after.dayLeft
  },
  processData(item) {
    const dayLeft = dayjs(item.expireDate).diff(dayjs().format('YYYY-MM-DD'), 'day', true)
    const expireTip = this.getDayLeftTip(dayLeft)
    const unitStr = this.getUnitStr(item.shelfLifeUnit)
    return {
      ...item,
      dayLeft,
      expireTip,
      unitStr
    }
  },
  getDayLeftTip(dayLeft) {
    if (dayLeft === 0) {
      return `⚠️ 今天过期，尽量不要使用`
    }
    if (dayLeft === 1) {
      return `⚠️ 明天过期，尽量今天使用`
    }
    if (dayLeft < 0) {
      return `⚠️ 已经过期，请丢弃`
    }
    return `还剩${dayLeft}天过期`
  },
  getUnitStr(unit) {
    switch (unit) {
      case 'day':
        return '天'
      case 'month':
        return '月'
      case 'year':
        return '年'
    }
  },
  gotoshelflife() {
    const pages = getCurrentPages()
    if (pages.length === 1) {
      wx.navigateTo({
        url: '../shelfLife/shelfLife'
      })
    } else {
      wx.navigateBack()
    }

  }
})