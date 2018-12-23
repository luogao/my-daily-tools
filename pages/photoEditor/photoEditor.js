// pages/photoEditor/photoEditor.js
import {
  REFERENCESCREENSIZE,
  DEFAULTDECORATIONWIDTH
} from '../../constants/index.js'
const {
  getImageInfo,
  simpleThrottle
} = require('../../utils/util.js')

const MAINPHOTOID = 'main-photo'
const mainPhotoCtx = wx.createCanvasContext(MAINPHOTOID)
const screenWidth = wx.getSystemInfoSync().screenWidth
const RPX = screenWidth / REFERENCESCREENSIZE
const ININELEMENTSTYLE = {
  width: 100,
  height: 100,
  top: 0,
  left: 0
}

let beforeRotateX = 200
let beforeRotateY = 200
let elementRoateTemp = 0

const userAvatar = 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoUmVMortCC1Oia8pIbH3icsyMJ42qMHLQnSsqaTx7UgByT6uuPh0c5gx28l7PwwU5zxibGzaSRDem1Q/0'

const hatPath = '../../images/christmas-hat-1.png'

let isDrag = false

const
  drawImagePromise = (path, ctx) => {
    return new Promise((resolve, reject) => {
      getImageInfo(path).then(res => {
        ctx.drawImage(res.path, 0, 0, screenWidth, screenWidth)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainPhotoSize: screenWidth,
    elementActive: true,
    elementDefaultSize: {
      width: 0,
      height: 0
    },
    elementDefaultPosition: {
      x: 0,
      y: 0
    },
    elementRoate: 0,
    elementTemp: 0,
    userAvatar,
    hasElementData: false,
    elementLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.elementScale = 1
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getElementInfo(hatPath)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getElementInfo(path) {
    getImageInfo(path).then(res => {
      const scale = res.width / res.height
      const width = DEFAULTDECORATIONWIDTH * RPX
      const height = DEFAULTDECORATIONWIDTH / scale * RPX
      const x = (screenWidth - width) / 2,
        y = (screenWidth - height) / 2
      this.elementWidth = width
      this.elementHeight = height
      this.setData({
        'elementDefaultSize.width': width,
        'elementDefaultSize.height': height,
        'elementDefaultPosition.x': x,
        'elementDefaultPosition.y': y,
        hasElementData: true
      })
    }).catch(console.log)
  },
  handleElementLoad() {
    this.setData({
      elementLoaded: true
    })
  },
  drawImage(ctx) {
    this.drawAvatar(ctx).then(() => {
        this.drawElement(ctx)
        ctx.draw(false, () => {
          this.saveImg()
        })
      })
      .catch(err => console.log(err))
  },
  drawElement(ctx) {
    const width = this.elementWidth
    const height = this.elementHeight
    ctx.save()
    ctx.translate(this.elementX + (width / 2), this.elementY + (height / 2))
    ctx.rotate(this.data.elementRoate * Math.PI / 180)
    ctx.drawImage(hatPath, -width / 2, -height / 2, width, height)
    ctx.restore()
  },
  drawAvatar(ctx) {
    return drawImagePromise(userAvatar, ctx)
  },
  drawHat(ctx) {
    return drawImagePromise(hatPath, ctx)
  },
  onElementChange(e) {
    if (!this.data.elementActive) {
      this.setData({
        elementActive: true
      })
    }
    this.setElementPosition(e.detail.x, e.detail.y)
  },
  handleElementNotActive() {
    this.setData({
      elementActive: false
    })
  },
  handleElementActive() {
    this.setData({
      elementActive: true
    })
  },
  handleRotate(e) {
    const centerX = this.elementX + (this.data.elementDefaultSize.width / 2)
    const centerY = this.elementY + (this.data.elementDefaultSize.height / 2)

    const diffXBefore = this.rotateStartX - centerX
    const diffYBefore = this.rotateStartY - centerY

    const diffXAfter = e.touches[0].clientX - centerX
    const diffYAfter = e.touches[0].clientY - centerY

    const angleBefore = Math.atan2(diffYBefore, diffXBefore) / Math.PI * 180
    const angleAfter = Math.atan2(diffYAfter, diffXAfter) / Math.PI * 180

    this.setData({
      elementRoate: elementRoateTemp + angleAfter - angleBefore
    })
  },
  handleRotateStart(e) {
    this.rotateStartX = e.touches[0].clientX
    this.rotateStartY = e.touches[0].clientY
    this.isRotating = true
  },
  handleRotateEnd() {
    this.isRotating = false
    elementRoateTemp = this.data.elementRoate
  },
  handleSave() {
    wx.showLoading({
      title: '稍等...',
    })
    this.elementWidth = this.data.elementDefaultSize.width * this.elementScale
    this.elementHeight = this.data.elementDefaultSize.height * this.elementScale
    this.drawImage(mainPhotoCtx)
  },
  saveImg() {
    wx.canvasToTempFilePath({
      destWidth: screenWidth * 2,
      destHeight: screenWidth * 2,
      canvasId: MAINPHOTOID,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail(err) {
            console.log(err)
            wx.showToast({
              icon: 'none',
              title: '保存失败',
            })
          }
        })
      }
    })
  },
  setElementPosition(x, y) {
    this.elementX = x
    this.elementY = y
  },
  handleScale(e) {
    this.elementScale = e.detail.scale
  }
})