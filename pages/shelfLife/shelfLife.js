// pages/shelfLife/shelfLife.js
const dayjs = require('dayjs')
const Goods = require('../../model/goods.js')
const AV = require('../../libs/av-weapp-min.js')

Page({
  data: {
    productionName: '',
    productionDate: '',
    shelflifeValue: 0,
    expireDate: '',
    dayLeftTip: '',
    shelfLifeUnit: 'month',
    isTyping: false,
    shelfLifeUnitOptions: [{
      value: 'day',
      name: '天'
    }, {
      value: 'month',
      name: '月',
      checked: true
    }, {
      value: 'year',
      name: '年'
    }]
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  handleProductionDateSelected(e) {
    this.setData({
      productionDate: e.detail.value
    })
  },
  radioChange(e) {
    this.setData({
      shelfLifeUnit: e.detail.value
    })
  },
  calculate() {
    const {
      productionDate,
      shelflifeValue,
      shelfLifeUnit
    } = this.data
    const result = dayjs(productionDate).add(Number(shelflifeValue), shelfLifeUnit).format('YYYY-MM-DD')
    const dayLeft = dayjs(result).diff(dayjs().format('YYYY-MM-DD'), 'day', true)
    this.setData({
      expireDate: result,
      dayLeftTip: this.getDayLeftTip(dayLeft)
    })
    this.saveRecord()
  },
  getDayLeftTip(dayLeft) {
    if (dayLeft === 0) {
      return `⚠️${this.data.productionName}今天过期，尽量不要使用`
    }
    if (dayLeft === 1) {
      return `⚠️${this.data.productionName}明天过期，尽量今天使用`
    }
    if (dayLeft < 0) {
      return `⚠️${this.data.productionName}已经过期，请丢弃`
    }
    return `${this.data.productionName}还剩${dayLeft}天过期`
  },
  reset() {
    this.setData({
      productionDate: '',
      shelflifeValue: 0,
      expireDate: '',
      dayLeftTip: ''
    })
  },
  handleShelflifeInput(e) {
    this.setData({
      shelflifeValue: e.detail.value || 0
    })
  },
  handleInputBlur() {
    this.setData({
      isTyping: false
    })
  },
  handleInputFocus() {
    this.setData({
      isTyping: true
    })
  },
  startTyping() {
    this.setData({
      isTyping: true
    })
  },
  handleProdutionNameInput(e) {
    this.setData({
      productionName: e.detail.value
    })
  },
  saveRecord() {
    const {
      productionName,
      productionDate,
      shelflifeValue,
      expireDate,
      shelfLifeUnit
    } = this.data
    wx.showLoading({
      title: 'saving record',
      mask: true
    })
    new Goods({
      productionName,
      productionDate,
      shelflifeValue,
      expireDate,
      shelfLifeUnit,
      user: AV.User.current()
    }).save().then(goods => {
      wx.hideLoading()
      wx.showToast({
        icon: 'success',
        duration: 1000
      })
    }).catch(console.log)
  }
})