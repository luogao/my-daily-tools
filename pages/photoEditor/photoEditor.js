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

const hatPath = '../../images/christmas-hat-1.png'

let isDrag = false

const
  drawImagePromise = (path, ctx, scale = 1) => {
    return new Promise((resolve, reject) => {
      getImageInfo(path).then(res => {
        console.log(res)
        const imageWidth = res.width
        const imageHeight = res.height
        const imageScale = imageWidth / imageHeight


        const screenImageScale = screenWidth / imageHeight * scale
        const afterHeight = imageHeight * imageScale
        const afterWidth = screenWidth * scale



        ctx.save()
        ctx.drawImage(res.path, 0, 0, afterWidth, afterHeight)
        ctx.restore()
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
    mainPhotoWidth: 0,
    mainPhotoHeight: 0,
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
    hasElementData: false,
    elementLoaded: false,
    selectImage: {
      url: '',
      scale: 1
    },
    borderColorList: ['#fff', 'black', '#c8c8c8', '#8c8c8c', '#fecd00', '#f48021', '#fe5f03', '#80d381', '#44b244', '#007000', '#72c5d5', '#1e71d8', '#2000ff', '#96398e', '#ffadba', '#ff4d4c', '#ff3400'],
    borderColorActiveIndex: 0
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
  async drawImage(ctx) {
    await this.drawMainImage(ctx)
    ctx.draw(false, () => {
      setTimeout(() => {
        this.saveImg(ctx)
      })
    })
  },
  async drawMainImage(ctx) {
    const imageRes = await getImageInfo(this.data.selectImage.url)
    const size = Math.max(imageRes.width, imageRes.height)
    const fillStyle = this.data.borderColorList[this.data.borderColorActiveIndex]
    let x1 = 0
    let y1 = 0
    let x2 = imageRes.width
    let y2 = imageRes.height
    if (size === imageRes.width) {
      y1 = (size - imageRes.height) / 2
    } else {
      x1 = (size - imageRes.width) / 2
    }

    this.setData({
      mainPhotoWidth: size,
      mainPhotoHeight: size
    })
    ctx.save()
    ctx.setFillStyle(fillStyle)
    ctx.fillRect(0, 0, size, size)
    ctx.translate(size / 2, size / 2)
    ctx.scale(this.data.selectImage.scale, this.data.selectImage.scale)
    ctx.drawImage(imageRes.path, x1 - size / 2, y1 - size / 2, x2, y2)
    ctx.restore()
  },
  drawBackgroundImage(ctx) {
    return drawImagePromise(this.data.selectImage.url, ctx, this.data.selectImage.scale)
  },

  handleSave() {
    wx.showLoading({
      title: '稍等...',
    })

    this.drawImage(mainPhotoCtx)
  },
  saveImg(ctx) {
    let size = Math.max(this.data.mainPhotoHeight, this.data.mainPhotoWidth)
    wx.canvasToTempFilePath({
      // destWidth: size * 0.5,
      // destHeight: size * 0.5,
      quality: 1,
      canvasId: MAINPHOTOID,
      success(res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
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
          },
          complete() {
            wx.hideLoading()
            ctx.clearRect(0, 0, size, size)
          }
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
  },
  handleUpload() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        self.setData({
          selectImage: {
            ...self.data.selectImage,
            url: res.tempFilePaths[0]
          }
        })
      }
    })
  },
  handleSliderChange(e) {
    this.setData({
      selectImage: {
        ...this.data.selectImage,
        scale: 1 - e.detail.value
      }
    })
  },
  handleColorChange(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      borderColorActiveIndex: index
    })
  }
})