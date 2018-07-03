const app = getApp()
var webhost = app.globalData.webhost;

Page({
  data: {
    region: ['福建省', '厦门市', '思明区'],
    receiver: '',
    phone: '',
    address: ''
  },

  setReceiver: function(e){
    this.setData({
      receiver: e.detail.value
    })
  },

  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  setAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

  addClick: function(){
    var that = this; 

    var data = {
      "address": that.data.address,
      "addressId": "",
      "province": that.data.region[0],
      "city": that.data.region[1],
      "area": that.data.region[2],
      "phone": that.data.phone,
      "street": '',
      "receiver": that.data.receiver
    };
    wx.request({
      url: webhost + "address/save?token=" + that.data.token,
      data: data,
      method: 'POST',
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '新增成功'
            })
            setTimeout(function(){
              wx.navigateBack({
                url: './listAddress'
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
  },

  onLoad: function (options) {
    var that = this;

  },

  onShow: function () {
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