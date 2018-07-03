//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs);

    // wx.clearStorage();

    wx.getStorage({
      key: 'token',
      success: function(res) {
        // console.log(res);
        // return false;
        var token = res.data;
        wx.request({
          url: that.globalData.webhost + "user/getUserInfo",
          data: {},
          header: {
            token: token
          },
          method: 'GET',
          success: function (res) {
            switch (+res.data.code) {
              case 0:
                that.globalData.token = token;
                break;
              case 401:
                that.globalData.token = '';
                wx.clearStorage();
                break;
            }
          }
        })
      },
      fail: () => {
        that.globalData.token = '';
        wx.clearStorage();
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    webhost: 'https://xmfkw.net:8080/anyue-background/app/',
    token: '',
    url: 'http://wx.53kf.com/sendwc.jsp?program=xcx&companyid=72179323&style_id=106239353',
    Token: '10179323',
    EncodingAESKey: 'bhyaA5Fj4BWLMEFeSO4hJuT0g8QGC0RwK082tiI6Zvs',
    appSecret:"0e00dca553111c43b95f3502d713c2ea"
  }
})