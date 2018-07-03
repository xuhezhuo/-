const app = getApp()
var webhost = app.globalData.webhost;
var getUser;
var getMsg;

Page({
  data: {
    isMsg: false,
    token: '',
    mobile: '',
    headImg: '',
    notPayCount: 0,
    notSendCount: 0,
    orderCount: 0,
    sendCount: 0
  },

  // 登录页
  openLoginWin: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  // 订单列表页
  openListOrderWin: function () {
    if(this.data.token == ''){
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: '../my/listOrder'
    })
  },

  // 待发货页
  openUndeliveryWin: function () {
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: './undelivery'
    })
  },

  // 待收货页
  openDeliveriedWin: function () {
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: './deliveried'
    })
  },

  // 已收货页
  openUnpayWin: function () {
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: './unPay'
    })
  },

  // 消息列表页
  opengMsgWin: function () {
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: '../my/listMsg'
    })
  },

  // 个人资料
  openPersonWin: function(){
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: './person'
    })
  },

  // 收货地址
  openAddressWin: function () {
    if (this.data.token == '') {
      wx.showModal({
        title: '未登录',
        content: '请先登录哦',
        confirmColor: '#4aa7fa',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: './listAddress'
    })
  },

  // 联系我们
  openContactWin: function () {
    wx.navigateTo({
      url: './contact'
    })
  },

  setImg: function () {
    var that = this;
    if(that.data.token == ''){
      return false;
    }
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // var file = res.tempFilePaths[0];
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: './avatar?src=' + src,
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;

    getUser = () => {
      wx.request({
        url: webhost + "user/getUserInfo",
        data: {},
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                mobile: res.data.data.account,
                headImg: res.data.data.picture,
                notPayCount: res.data.data.count.notPayCount,
                notSendCount: res.data.data.count.notSendCount,
                orderCount: res.data.data.count.orderCount,
                sendCount: res.data.data.count.sendCount,
              })
              break;
            case 401:
              wx.showModal({
                title: '用户已过期',
                content: '请重新登录',
                confirmColor: '#4aa7fa',
                success: (res) => {
                  if(res.confirm){
                    wx.redirectTo({
                      url: '../login/login'
                    })
                  }
                }
              })
              break;
          }
        }
      })
    }

    getMsg = () => {
      wx.request({
        url: webhost + "message/hasUnread",
        data: {},
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              if(res.data.data){
                that.setData({
                  isMsg: true
                })
              } else {
                that.setData({
                  isMsg: false
                })
              }
              break;
            case 401:
              wx.showModal({
                title: '用户已过期',
                content: '请重新登录',
                confirmColor: '#4aa7fa',
                success: (res) => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../login/login'
                    })
                  }
                }
              })
              break;
          }
        }
      })
    }
  },

  onShow: function () {
    var that = this;
    if(app.globalData.token != ''){
      that.setData({
        token: app.globalData.token
      })
      getUser();
      getMsg();
    } else {
      that.setData({
        isMsg: false,
        token: '',
        mobile: '',
        headImg: '',
        notPayCount: 0,
        notSendCount: 0,
        orderCount: 0,
        sendCount: 0
      })
    }
  },

  onShareAppMessage: function () {
  
  }
})