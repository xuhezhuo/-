const app = getApp()
var webhost = app.globalData.webhost;
var md5 = require('../../utils/md5.js')    
var getAddress;
var pay;

Page({
  data: {
    receiver: '',
    phone: '',
    province: '',
    city: '',
    area: '',
    stress: '',
    address: '',
    itemList: [],
    token: '',
    total: 0,
    totalFreight: 0,
    totalMoney: 0,
    time: true,
    hasAddress: true
  },

  setAddress: function() {
    wx.navigateTo({
      url: '../my/listAddress'
    })
  },

  addOrder: function() {
    var that = this;
    if (that.data.receiver == '' || that.data.phone == '' || that.data.province == ''){
      wx.showModal({
        title: '未选择地址',
        content: '请先选择地址信息',
        confirmColor: '#4aa7fa',
        showCancel: false      
      })
      return false;
    }  
    wx.showLoading({
      title: '正在生成订单'
    })
    var list = that.data.itemList;
    var dataList = new Array();
    for (var i = 0; i < list.length; i++) {
      var item = {};
      item.number = list[i].number;
      item.productId = list[i].productId;
      item.typeId = list[i].productTypeId;
      dataList.push(item);
    }
    var data = {
      "address": that.data.address,
      "area": that.data.area,
      "city": that.data.city,
      "detailList": dataList,
      "phone": that.data.phone,
      "province": that.data.province,
      "receiver": that.data.receiver,
      "street": that.data.street,
      "totalFreight": that.data.totalFreight,
      "totalMoney": that.data.totalMoney,
      "totalNumber": that.data.total
    };
    wx.request({
      url: webhost + "order/addOrder",
      data: data,
      header: {
        token: that.data.token
      },
      method: 'POST',
      complete: function() {
        wx.hideLoading();
      },
      success: function(res) {
        switch (+res.data.code) {
          case 0:
            // wx.showToast({
            //   title: '提交订单成功',
            // })
            var orderNumber = res.data.data.orderNumber;
            var orderId = res.data.data.orderId;
            // 登录
            wx.login({
              success: res => {
                var code = res.code;
                console.log(res);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                pay(code, orderNumber, that.data.totalMoney, orderId);
              }
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
        wx.showModal({
          title: '网络连接失败',
          content: '您的网络似乎有问题哦',
          confirmColor: '#4aa7fa',
          showCancel: false
        })
      }
    })
  },

  onLoad: function(options) {
    var that = this;

    if (options.data) {
      var data = JSON.parse(options.data);
      that.setData({
        itemList: data
      })
      console.log(data);
      var total = 0;
      var totalFreight = 0;
      var totalMoney = 0;
      var totalPrice = 0;
      for (var i = 0; i < data.length; i++) {
        total += data[i].number;
        totalFreight += data[i].number * data[i].freight;
        totalPrice += data[i].number * data[i].price;
      }
      totalMoney = totalFreight + totalPrice;
      that.setData({
        total: total,
        totalFreight: totalFreight,
        totalMoney: totalMoney
      })
    }

    getAddress = () => {
      var data = {

      };
      wx.request({
        url: webhost + "address/getDefault",
        data: data,
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              if (res.data.data) {
                that.setData({
                  receiver: res.data.data.receiver,
                  phone: res.data.data.phone,
                  address: res.data.data.address,
                  province: res.data.data.province,
                  street: res.data.data.street,
                  city: res.data.data.city,
                  area: res.data.data.area
                })
              } else {
                that.setData({
                  hasAddress: false
                })
              }
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
        fail: function(res) {
          that.setData({
            connect: false
          })
        }
      })
    }

    pay = (code, orderNumber, money, orderId) => {
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
        success: function(res) {
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
                'success': function(res) {
                  wx.showToast({
                    title: '支付成功'
                  })
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '../my/orderdetail?id=' + orderId
                    })
                  }, 1200)
                },
                'fail': function(res) {
                  wx.showToast({
                    title: '支付失败'
                  })
                },
                'complete': function(res) {

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
        fail: function(res) {
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
      if (that.data.time) {
        getAddress();
      }
    } else {
      that.setData({
        token: ''
      })
    }
  }
})