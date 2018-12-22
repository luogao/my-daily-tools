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
    elementSize: {
      width: 0,
      height: 0
    },
    elementPosition: {
      top: ININELEMENTSTYLE.top,
      left: ININELEMENTSTYLE.left
    },
    elementRoate: 0,
    elementTemp: 0,
    userAvatar
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
    // this.setElementPosition = simpleThrottle(this.setElementPosition, 100)
    getImageInfo(hatPath).then(res => {
      const scale = res.width / res.height
      this.setData({
        'elementSize.width': DEFAULTDECORATIONWIDTH * RPX,
        'elementSize.height': DEFAULTDECORATIONWIDTH / scale * RPX,
      })
    }).catch(console.log)
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
  drawImage(ctx) {
    const {
      elementSize,
      elementPosition,
      elementRoate
    } = this.data
    this.drawAvatar(ctx).then(() => {
        ctx.save()
        ctx.translate(elementPosition.left + (elementSize.width / 2), elementPosition.top + (elementSize.height / 2))
        ctx.rotate(elementRoate * Math.PI / 180)
        ctx.drawImage(hatPath, -elementSize.width / 2, -elementSize.height / 2, elementSize.width, elementSize.height)
        ctx.restore()
        ctx.draw(false, () => {
          this.saveImg()
        })
      })
      .catch(err => console.log(err))
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
    const centerX = this.data.elementPosition.left + (this.data.elementSize.width / 2)
    const centerY = this.data.elementPosition.top + (this.data.elementSize.height / 2)

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
    this.setData({
      'elementPosition.left': x,
      'elementPosition.top': y
    })
  },
  // handleResize(e) {
  //   const diffX = e.touches[0].clientX - this.resizeStartX
  //   const diffWidth = this.data.elementSize.width + diffX
  //   const scale = diffWidth / this.data.elementSize.width
  //   console.log(scale)
  //   this.setData({
  //     elementScale: scale
  //   })
  // },
  // handleResizeStart(e) {
  //   this.isResizing = true
  //   this.resizeStartX = e.touches[0].clientX
  // },
  // handleResizeEnd() {
  //   this.isResizing = false
  //   this.setData({
  //     'elementSize.width': this.data.elementSize.width * this.data.elementScale,
  //     'elementSize.height': this.data.elementSize.height * this.data.elementScale
  //   })
  // }
})