const app = getApp();
var webhost = app.globalData.webhost;
var getCode;

Page({
  data: {
    timer: '发送验证码',
    mobile: '',
    code: ''
  },

  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  sentCode: function () {
    var that = this;
    if (that.data.timer != '发送验证码') {
      return false;
    }
    if (that.data.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请先填写手机号码',
        confirmColor: '#4aa7fa'
      })
      return false;
    }
    getCode();
    var time = 60;
    var setTime = function () {
      if (time > 0) {
        setTimeout(function () {
          time--;
          that.setData({
            timer: '还剩' + time + '秒'
          })
          setTime();
        }, 1000);
      } else {
        that.setData({
          timer: '发送验证码'
        })
      }
    }
    setTime();
  },

  Login: function () {
    var that = this;
    wx.request({
      url: webhost + "login",
      data: {
        mobile: that.data.mobile,
        validCode: that.data.code
      },
      method: 'POST',
      success: function (res) {
        // return false;
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '登录成功！',
              duration: 1200
            })
            app.globalData.token = res.data.data.token;
            app.globalData.userId = res.data.data.user.userId;
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            })
            setTimeout(function () {
              if (res.data.data.user.name == null || res.data.data.user.name == ""){
                wx.navigateTo({
                  url: './register'
                })
              } else{
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }, 1200);
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
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmColor: '#a53f35',
          content: '连接失败，请检查网络'
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;

    getCode = function () {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + 'smsCode/get/' + that.data.mobile,
        data: {

        },
        method: 'GET',
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 1000
              });
              break;
            case 1:
              wx.showToast({
                title: '连接超时',
                icon: 'loading'
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
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#4aa7fa',
            content: '服务器异常'
          })
        }
      })
    }
  }

})