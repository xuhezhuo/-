const app = getApp()
var webhost = app.globalData.webhost;
var getOrder;

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