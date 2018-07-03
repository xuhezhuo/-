const app = getApp()
var webhost = app.globalData.webhost;
var listAddress;

Page({
  data: {
    addressList: [],
    token: '',
    pageNo: 1,
    pageSize: 10
  },

  addressClick: function(e) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (prevPage.route == 'pages/cart/buy') {
      var index = e.currentTarget.dataset.index;
      var address = that.data.addressList[index];
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        receiver: address.receiver,
        phone: address.phone,
        address: address.address,
        province: address.province,
        street: address.street,
        city: address.city,
        area: address.area,
        time: false,
        hasAddress: true
      });

      wx.navigateBack({
        url: '../cart/buy'
      })
    }

  },

  radioChange: function(e) {
    var that = this;
    var list = that.data.addressList;
    var index = e.detail.value;
    var id = list[index].addressId;
    wx.showNavigationBarLoading();
    wx.request({
      url: webhost + "address/setDefault/" + id,
      data: {},
      header: {
        token: that.data.token
      },
      method: 'GET',
      success: function(res) {
        wx.hideNavigationBarLoading();
        switch (+res.data.code) {
          case 0:
            listAddress();
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
  },

  addClick: function() {
    wx.navigateTo({
      url: './addAddress'
    })
  },

  setClick: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './setAddress?id=' + id
    })
  },

  onLoad: function(options) {
    var that = this;

    listAddress = () => {
      var data = {
        "keywords": "",
        "page": that.data.pageNo,
        "size": that.data.pageSize
      };
      wx.request({
        url: webhost + "address/list?token=" + that.data.token,
        data: data,
        method: 'POST',
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                addressList: res.data.data
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
                title: '服务器好像出现问题了',
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
      listAddress();      
    } else {
      that.setData({
        token: ''
      })
    }
  }
})