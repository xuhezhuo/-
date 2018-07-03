import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight;

const app = getApp()
var webhost = app.globalData.webhost;

var pages = getCurrentPages();
var currPage = pages[pages.length - 1]; //当前页面
var prevPage = pages[pages.length - 2]; //上一个页面

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },

  touchStart(e) {
    this.wecropper.touchStart(e)
  },

  touchMove(e) {
    this.wecropper.touchMove(e)
  },

  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },

  getCropperImage() {
    this.wecropper.getCropperImage((avatar) => {
      console.log(avatar);
      if (avatar) {
        //  获取到裁剪后的图片
        wx.showLoading({
          title: '正在提交',
        })
        wx.uploadFile({
          url: webhost + 'user/picture/upload',
          filePath: avatar,
          name: 'file',
          header: {
            "Accept": "*/*",
            "token": this.data.token
          },
          method: 'POST',
          complete:function(){
            wx.hideLoading();
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            switch (data.code) {
              case 0:
                wx.showToast({
                  title: '修改头像成功'
                })
                setTimeout(function () {
                  wx.navigateBack({
                    url: prevPage
                  })
                },1200)
                break;
              case 500:
                wx.showToast({
                  title: '修改失败'
                })
                break;
            }
          }
        })
      } else {
        wx.showToast({
          title: '获取图片失败，请稍后重试',
        })
        setTimeout(function(){
          wx.navigateBack({
            url: prevPage
          })
        },1200)
      }
    })
  },

  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },

  onLoad:function(options) {
    var that = this;
    const cropperOpt = that.data.cropperOpt;
    console.log(cropperOpt);
    console.log(options.src);

    if (options.src) {
      cropperOpt.src = options.src
      // 实例画布截图
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log('wecropper is ready for work!')
        })
        .on('beforeImageLoad', (ctx) => {
          console.log('before picture loaded, i can do something')
          console.log('current canvas context:', ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 2000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log('picture loaded')
          console.log('current canvas context:', ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log('before canvas draw,i can do something')
          console.log('current canvas context:', ctx)
        })
        .updateCanvas()
    }
  },

  onShow: function(){
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
    } else {
      that.setData({
        token: ''
      })
    }
  }
})