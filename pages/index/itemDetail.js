const app = getApp()
var webhost = app.globalData.webhost;
var getItem;
var skillId = '';

Page({
  data: {
    detail: '',
    load: false
  },

  openTabWin: function(e){
    var that = this;
    var tab = e.currentTarget.dataset.tab;
    wx.navigateTo({
      url: './itemOption?tab=' + tab + '&id=' + skillId
    })
  },

  openProductWin: () => {
    wx.navigateTo({
      url: './skillProduct?id=' + skillId
    })
  },

  loaded: function(){
    var that = this;
    that.setData({
      load: true
    })
    wx.hideLoading();
  },

  onLoad: function (options) {
    var that = this;

    if (options.id) {
      skillId = options.id;
    }

    wx.showLoading({
      title: '加载中'
    })

    getItem = () => {
      wx.request({
        url: webhost + "skill/detail/" + skillId,
        data: {

        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                detail: res.data.data.detail
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

    getItem();
  },

  onShow: function () {
  
  },
  
  onShareAppMessage: function (res) {

  }
})