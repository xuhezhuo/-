const app = getApp()
var webhost = app.globalData.webhost;
var getConsult;

Page({
  data: {
    itemList: []
  },

  openSearchWin: () => {
    wx.navigateTo({
      url: './search'
    })
  },

  openDetailWin: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: './consultDetail?index=' + index,
    })
  },

  onLoad: function (options) {
    var that = this;

    getConsult = () => {
      var data = {
        "keywords": "",
        "page": "1",
        "size": "10"
      }
      wx.request({
        url: webhost + "consult/list",
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

    getConsult();
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }
})