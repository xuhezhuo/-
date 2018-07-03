const app = getApp()
var webhost = app.globalData.webhost;
var getProduct;

Page({
  data: {
    tab: 1,
    // search: '',
    productList: [],
    skillId: ''
  },

  tabClick: function (e) {
    var that = this;
    var tab = +e.currentTarget.dataset.tab;
    if (tab === that.data.tab) {
      return false;
    } else {
      that.setData({
        tab: tab
      })
      getProduct();
    }
  },

  openDetailWin: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../category/detail?id=' + id
    })
  },

  onLoad: function (options) {
    var that = this;

    // console.log(options);

    if (options.id){
      that.setData({
        skillId: options.id
      })
    }

    getProduct = () => {
      var data = {
        "keywords": that.data.skillId,
        "page": "1",
        "size": "10",
        'type': that.data.tab
      }
      wx.request({
        url: webhost + "getProductBySkillId",
        data: data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                productList: res.data.data  //动态列表
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

  }
})