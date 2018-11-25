// pages/shelfLife/shelfLife.js
const dayjs = require('dayjs')
Page({
  data: {
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
    const dayLeft = dayjs(result).diff(dayjs(), 'day')
    console.log(dayLeft)
    this.setData({
      expireDate: result,
      dayLeftTip: this.getDayLeftTip(dayLeft)
    })
  },
  getDayLeftTip(dayLeft) {
    if (dayLeft === 0) {
      return `⚠️该物品今天过期，尽量不要使用`
    }
    if (dayLeft < 0) {
      return `⚠️该物品已经过期，请丢弃`
    }
    return `该物品还剩${dayLeft}天过期`
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
  }
})