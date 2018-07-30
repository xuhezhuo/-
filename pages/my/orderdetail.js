const app = getApp()
var webhost = app.globalData.webhost;
var getOrder;
var pay;

var pages = getCurrentPages();
var currPage = pages[pages.length - 1]; //当前页面
var prevPage = pages[pages.length - 2]; //上一个页面

Page({
  data: {
    orderId: '',
    receiver: '',
    phone: '',
    address: '',
    itemList: [],
    logisticsNumber: '',
    orderNumber: '',
    status: '',
    totalFreight: 0,
    totalMoney: 0,
    totalNumber: 0,
    createTime: ''
  },

  openLogisticsWin: function () {
    var that = this;
    var num = that.data.logisticsNumber;
    if (!num){
      wx.showModal({
        title: '未发货',
        content: '您的商品还未发货哦',
        confirmColor: '#4aa7fa',
        showCancel: false
      })
      return false;
    }
    wx.navigateTo({
      url: './logistics?num=' + num
    })
  },

  openIndexWin: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },

  cancel: function () {
    var that = this;

    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单？',
      confirmColor: '#4aa7fa',
      success: function (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.request({
            url: webhost + "order/delete/" + that.data.orderId,
            data: {},
            method: 'GET',
            header: {
              token: that.data.token
            },
            complete: function () {
              wx.hideNavigationBarLoading();
            },
            success: function (res) {
              switch (+res.data.code) {
                case 0:
                  wx.showToast({
                    title: '订单已取消'
                  })
                  setTimeout(function(){
                    wx.navigateBack({
                      url: prevPage
                    })
                  },1200)
                  break;
                case 401:
                  wx.showModal({
                    title: '未登录',
                    content: '请先登录',
                    confirmColor: '#4aa7fa',
                    success: (res) => {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../login/login'
                        })
                      }
                    }
                  })
                  break;
                case 500:
                  wx.showModal({
                    title: '发现问题了',
                    content: res.data.msg,
                    showCancel: false,
                    confirmColor: '#4aa7fa'
                  })
              }
            }
          })
        }
      }
    })
  },

  pay: function (e) {
    var that = this;
    var orderNumber = that.data.orderNumber;
    var money = that.data.totalMoney;
    wx.login({
      success: res => {
        var code = res.code;
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        pay(code, orderNumber, money);
      }
    })
  },


  copyClick: function(){
    wx.setClipboardData({
      data: this.data.orderNumber,
      success: function (res) {
        wx.showToast({
          title: '已复制到粘贴板',
        })
      }
    })

  },

  onLoad: function(options) {
    var that = this;

    if (options.id) {
      that.setData({
        orderId: options.id
      })
    }

    getOrder = () => {
      wx.showNavigationBarLoading();
      var data = {

      };
      wx.request({
        url: webhost + "order/detail/" + that.data.orderId,
        data: data,
        method: 'GET',
        header: {
          token: that.data.token
        },
        complete: function() {
          wx.hideNavigationBarLoading();
        },
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              var data = res.data.data;
              var address;
              if (data.receiveInfo.street){
                address = data.receiveInfo.province + data.receiveInfo.city + data.receiveInfo.area + data.receiveInfo.street + data.receiveInfo.address;
              } else {
                address = data.receiveInfo.province + data.receiveInfo.city + data.receiveInfo.area + data.receiveInfo.address
              }
              that.setData({
                receiver: data.receiveInfo.receiver,
                phone: data.receiveInfo.phone,
                address: address,
                itemList: data.detailList,
                logisticsNumber: data.logisticsNumber,
                orderNumber: data.orderNumber,
                status: data.status,
                totalFreight: data.totalFreight,
                totalMoney: data.totalMoney,
                totalNumber: data.totalNumber,
                createTime: data.createTime
              })
              break;
            case 401:
              wx.showModal({
                title: '未登录',
                content: '请先登录',
                confirmColor: '#4aa7fa',
                success: (res) => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../login/login'
                    })
                  }
                }
              })
              break;
            case 500:
              wx.showModal({
                title: '发现问题了',
                content: res.data.msg,
                showCancel: false,
                confirmColor: '#4aa7fa'
              })
          }
        },
        fail: function(res) {
          that.setData({
            connect: false
          })
        }
      })
    }

    pay = (code, orderNumber, money) => {
      var data = {
        "code": code,
        "orderNumber": orderNumber,
        "totalMoney": money
      }
      wx.request({
        url: webhost + "wx/xcx/pay",
        data: data,
        header: {
          token: that.data.token
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              wx.requestPayment({
                'timeStamp': res.data.value.timeStamp + '',
                'nonceStr': res.data.value.nonceStr,
                'package': res.data.value.package,
                'signType': 'MD5',
                'paySign': res.data.value.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功'
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                      url: prevPage
                    })
                  }, 1200)
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败'
                  })
                },
                'complete': function (res) {

                }
              })
              break;
            case 401:
              wx.showModal({
                title: '未登录',
                content: '请先登录',
                success: (res) => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../login/login'
                    })
                  }
                }
              })
              break;
            case 500:
              wx.showModal({
                title: '发现问题了',
                content: res.data.msg,
                showCancel: false,
                confirmColor: '#4aa7fa'
              })
          }
        },
        fail: function (res) {
          that.setData({
            connect: false
          })
        }
      })
    }
  },

  onShow: function() {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      getOrder();      
    } else {
      that.setData({
        token: ''
      })
    }
  },

  onPullDownRefresh: function() {

  }
})