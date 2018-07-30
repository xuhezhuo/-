const app = getApp()
var webhost = app.globalData.webhost;
var listOrder;
var pay;

Page({
  data: {
    token: '',
    orderList: [],
    pageNo: 1,
    pageSize: 10,
    first: true
  },

  openDetailWin: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './orderdetail?id=' + id
    })
  },

  cancel: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单？',
      confirmColor: '#4aa7fa',
      success: function(res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          var data = {

          };
          wx.request({
            url: webhost + "order/delete/" + orderId,
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
                  that.setData({
                    pageNo: 1,
                    orderList: []
                  })
                  listOrder();
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
    var orderNumber = e.currentTarget.dataset.num;
    var money = e.currentTarget.dataset.money;
    wx.login({
      success: res => {
        var code = res.code;
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        pay(code, orderNumber, money);
      }
    })
  },

  onLoad: function(options) {
    var that = this;

    listOrder = () => {
      wx.showNavigationBarLoading();
      var data = {
        "page": that.data.pageNo,
        "size": that.data.pageSize
      };
      wx.request({
        url: webhost + "order/list",
        data: data,
        method: 'POST',
        header: {
          token: that.data.token
        },
        complete: function() {
          wx.hideNavigationBarLoading();
        },
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                orderList: (that.data.orderList).concat(res.data.data),
                first: false
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
              console.log(res.data.value);
              // return false;
              // var paySign = md5.hexMD5('appId=' + res.data.value.appid + '&nonceStr=' + res.data.value.noncestr + '&package=' + res.data.value.package + '&signType=MD5&timeStamp=' + res.data.value.timestamp + '&key=iffnMzAEvmTYtlWjZqi1ka3yKGh411pL');
              wx.requestPayment({
                'timeStamp': res.data.value.timeStamp + '',
                'nonceStr': res.data.value.nonceStr,
                'package': res.data.value.package,
                'signType': 'MD5',
                // 'paySign': paySign,
                'paySign': res.data.value.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功'
                  });
                  that.setData({
                    pageNo: 1,
                    orderList: []
                  })
                  listOrder();
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
        token: app.globalData.token,
        orderList: [],
        pageNo: 1
      })
      // if (that.data.first) {
        listOrder();
      // }
    } else {
      that.setData({
        token: ''
      })
    }

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {
    var that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    listOrder();
  }
})