const app = getApp()
var webhost = app.globalData.webhost;
var listOrder;

Page({
  data: {
    token: '',
    orderList: [],
    pageNo: 1,
    pageSize: 10,
    first: true
  },

  openDetailWin: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './orderdetail?id=' + id
    })
  },

  onLoad: function (options) {
    var that = this;

    listOrder = () => {
      wx.showNavigationBarLoading();
      var data = {
        "page": that.data.pageNo,
        "size": that.data.pageSize,
        'orderStatus': 1
      };
      wx.request({
        url: webhost + "order/list",
        data: data,
        method: 'POST',
        header: {
          token: that.data.token
        },
        complete: function () {
          wx.hideNavigationBarLoading();
        },
        success: function (res) {
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
        fail: function (res) {
          that.setData({
            connect: false
          })
        }
      })
    }
  },

  onShow: function () {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      if (that.data.first) {
        listOrder();
      }    
    } else {
      that.setData({
        token: ''
      })
    }
  },

  onReachBottom: function () {
    var that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    listOrder();
  }
})