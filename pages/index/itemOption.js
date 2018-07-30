const app = getApp()
var webhost = app.globalData.webhost;
var getItem;
var skillId = '';

Page({
  data: {
    active: 1,
    cases: '',
    detail: '',
    videoList: ''
  },

  openProductWin: () => {
    wx.navigateTo({
      url: './skillProduct?id=' + skillId
    })
  },

  loaded: function () {
    var that = this;
    that.setData({
      load: true
    })
    wx.hideLoading();
  },
  
  tabClick: function(e){
    var that = this;
    var tab = +e.currentTarget.dataset.tab;
    if ( tab == 1 ) {
      that.setData({
        active: 1
      })
      wx.setNavigationBarTitle({
        title: '相关视频'
      })
    } else if ( tab == 2 ) {
      that.setData({
        active: 2
      })
      wx.setNavigationBarTitle({
        title: '经典案例'
      })
    }
  },

  onLoad: function(options) {
    var that = this;

    wx.showLoading({
      title: '加载中'
    })

    setTimeout(function(){
      that.setData({
        load: true
      })
      wx.hideLoading();
    },1000)

    if (options.id) {
      skillId = options.id;
    }

    if (options.tab) {
      if (+options.tab == 1){
        that.setData({
          active: 1
        })
        wx.setNavigationBarTitle({
          title: '视频相关'
        })
      } else if (+options.tab == 2){
        that.setData({
          active: 2
        })
        wx.setNavigationBarTitle({
          title: '经典案例'
        })
      }
    }

    getItem = () => {
      wx.request({
        url: webhost + "skill/detail/" + skillId,
        data: {

        },
        method: 'GET',
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                cases: res.data.data.cases,
                detail: res.data.data.detail,
                videoList: res.data.data.videoList
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

    getItem();
  },

  onShow: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function (res) {

  }
})