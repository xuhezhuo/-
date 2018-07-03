const app = getApp()
var webhost = app.globalData.webhost;

Page({
  data: {
    sex: 0,
    sexList: ['女' , '男'],
    name: '',
    firm: '',
    token: ''
  },

  bindName: function(e){
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },

  bindFirm: function (e) {
    console.log(e.detail.value);
    this.setData({
      firm: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      sex: +e.detail.value
    })
  },

  submit: function(){
    var that = this;
    if (that.data.firm == "" || that.data.name == ""){
      wx.showModal({
        title: '信息未完善',
        content: '请先完善您的信息',
        showCancel: false
      })
      return false;
    }
    var data = {
      "company": that.data.firm,
      "name": that.data.name,
      "sex": that.data.sex
    }
    console.log(data);
    wx.request({
      url: webhost + "user/updateUserInfo",
      data: data,
      header: {
        token: that.data.token
      },
      method: 'POST',
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '提交成功'
            })
            setTimeout(function(){
              wx.switchTab({
                url: '../index/index'
              })
            }, 1200)
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
  },

  onLoad: function (options) {
  
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