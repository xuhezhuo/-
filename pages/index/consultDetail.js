const app = getApp()
var webhost = app.globalData.webhost;
var WxParse = require('../wxParse/wxParse.js');
var getConsult;

Page({
  data: {
  
  },

  onLoad: function (options) {
    var that = this;

    if(options.index){
      that.setData({
        index: options.index
      })
    }

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
              var data = res.data.data[that.data.index];
              that.setData({
                title: data.title,
                time: data.createTime
              })
              var article = data.detail;
              WxParse.wxParse('article', 'html', article, that, 5);
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
  }
})