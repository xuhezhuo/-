const app = getApp()
var webhost = app.globalData.webhost;
var getProduct;

Page({
  data: {
    tab: 1,
    pageNo: 1,
    pageSize: 10,
    keyword: '',
    productList: []
  },

  bindKeyword: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  tabClick: function(e) {
    var that = this;
    var tab = +e.currentTarget.dataset.tab;
    if( tab === that.data.tab){
      return false;
    } else{
      that.setData({
        paggNo: 1,
        productList: [],
        tab: tab
      })
      getProduct();
    }
  },

  search: function () {
    var that = this;
    that.setData({
      pageNo: 1,
      productList: []
    })
    getProduct();
  },

  openDetailWin: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../category/detail?id=' + id
    })
  },

  onLoad: function (options) {
    var that = this;

    getProduct = () => {
      var data = {
        "keywords": that.data.keyword,
        "page": that.data.pageNo,
        "size": that.data.pageSize,
        'type': that.data.tab
      }
      wx.request({
        url: webhost + "product/list",
        data: data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                productList: (that.data.productList).concat(res.data.data)  //动态列表
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

    getProduct();
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
    getProduct();
  }
})