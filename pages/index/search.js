const app = getApp()
var webhost = app.globalData.webhost;
var search;

Page({
  data: {
    itemList: [],
    pageNo: 1,
    pageSize: 10,
    keyword: ''
  },

  bindKeyword: function(e){
    this.setData({
      keyword: e.detail.value
    })
  },

  searchT: function(){
    that.setData({
      pageNo: 1,
      itemList: []
    })
    search();
  },

  openDetailWin: function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var t = e.currentTarget.dataset.type;
    if (t == 'S') {
      wx.navigateTo({
        url: './itemDetail?id=' + id
      })
    } else if (t == 'P') {
      wx.navigateTo({
        url: '../category/detail?id=' + id
      })
    }
  },

  onLoad: function (options) {
    var that = this;

    if (options.keyword) {
      Type = options.keyword;
    }

    search = () => {
      var data = {
        "keywords": that.data.keyword,
        "page": that.data.pageNo,
        "size": that.data.pageSize
      }
      wx.request({
        url: webhost + "index/search",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                itemList: (that.data.itemList).concat(res.data.data)
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

  },

  onShow: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
    var that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    search();
  }
})