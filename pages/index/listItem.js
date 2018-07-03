const app = getApp()
var webhost = app.globalData.webhost;
var listItem;
var Type = '';

Page({
  data: {
    itemList: [],
    pageNo: 1,
    pageSize: 10,
    keywords: ''
  },

  search: function(){
    that.setData({
      pageNo: 1,
      itemList: []
    })
    listItem();
  },

  bindKeywords: function(e){
    this.setData({
      keywords: e.detail.value
    })
  },

  openDetailWin: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './itemDetail?id=' + id
    })
  },

  onLoad: function (options) {
    var that = this;

    if(options.keyword){
      Type = options.keyword;
    }

    if(options.title){
      wx.setNavigationBarTitle({
        title: options.title
      })
    }

    listItem = () => {
      var data = {
        "keywords": that.data.keywords,
        "page": that.data.pageNo,
        "size": that.data.pageSize,
        "type": Type
      }
      wx.request({
        url: webhost + "skill/list",
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

    listItem();

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
    listItem();
  }
})