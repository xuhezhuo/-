const app = getApp()
var webhost = app.globalData.webhost;
var getNews;

Page({
  data: {
    itemList: []
  },

  openSearchWin: () => {
    wx.navigateTo({
      url: './search'
    })
  },

  onLoad: function (options) {
    var that = this;

    getNews = () => {
      var data = {
        "keywords": "",
        "page": "1",
        "size": "10"
      }
      wx.request({
        url: webhost + "news/list",
        data: data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                itemList: res.data.data  //动态列表
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

          }
        },
        fail: function (res) {
          that.setData({
            connect: false
          })
        }
      })
    };

    getNews();
  },

  onShow: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  }
})