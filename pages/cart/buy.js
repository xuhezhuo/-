const app = getApp()
var webhost = app.globalData.webhost;
var getAddress;

Page({
  data: {
    receiver: '',
    phone: '',
    province: '',
    city: '',
    area: '',
    stress: '',
    address: '',
    itemList: [1, 2, 3],
    token: '',
    total: 0,
    totalFreight: 0,
    totalMoney: 0,
    time: true,
    hasAddress: true
  },

  setAddress: function(){
    wx.navigateTo({
      url: '../my/listAddress'
    })
  },

  addOrder: function() {
    wx.showLoading({
      title: '正在生成订单'
    })
    var that = this;
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
      complete: function(){
        wx.hideLoading();        
      },
      success: function(res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '提交订单成功',
            })
            // wx.requestPayment({
            //   'timeStamp': '',
            //   'nonceStr': '',
            //   'package': '',
            //   'signType': 'MD5',
            //   'paySign': '',
            //   'success': function(res) {},
            //   'fail': function(res) {},
            //   'complete': function(res) {}
            // })
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
              if (res.data.data){
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


  },

  onShow: function() {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      if(that.data.time){
        getAddress();
      }
    } else{
      that.setData({
        token: ''
      })
    }
  }
})