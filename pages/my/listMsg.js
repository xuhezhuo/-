const app = getApp()
var webhost = app.globalData.webhost;
var listMsg1;
var listMsg2;

Page({
  data: {
    itemList: [], //未读消息 
    itemList2: [], //历史消息 
  },

  check: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var Type = e.currentTarget.dataset.type;
    var link = e.currentTarget.dataset.link;
    wx.request({
      url: webhost + "message/read/" + id,
      data: {},
      header: {
        token: that.data.token
      },
      method: 'GET',
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            listMsg1();
            listMsg2();
            if (Type == 0 || Type == 1){
              wx.navigateTo({
                url: './orderdetail?id=' + link,
              })
            } else {
              wx.navigateTo({
                url: './logistics?link=' + link,
              })
            }
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
    var that = this;

    listMsg1 = () => {
      var data = {
        "page": "1",
        "size": "10",
        "status": 0
      }
      wx.request({
        url: webhost + "message/list",
        data: data,
        header: {
          token: that.data.token
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                itemList: res.data.data
              })
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
    }

    listMsg2 = () => {
      var data = {
        "page": "1",
        "size": "10",
        "status": 1
      }
      wx.request({
        url: webhost + "message/list",
        data: data,
        header: {
          token: that.data.token
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                itemList2: res.data.data
              })
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
    }
  },

  onShow: function () {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      listMsg1();
      listMsg2();
    } else {
      that.setData({
        token: ''
      })
    }
  },

  onShareAppMessage: function () {
  
  }
})