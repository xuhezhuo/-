const app = getApp()
var webhost = app.globalData.webhost;
var getDetail;

Page({
  data: {
    token: '',
    productId: '',
    banner: '',
    cases: [],
    freight: '',
    logisticMemo: '',
    material: '',
    maxMoney: '',
    memo: '',
    minMoney: '',
    place: '',
    price: '',
    size: '',
    title: '',
    types: [],
    productTypeId: '',
    sellPrice: '',
    totalPrice: '',
    selectMemo: '',
    amount: 1
  },

  showClick: function() {
    var s = this;
    if (!s.data.show) {
      s.setData({
        show: true
      })
    } else {
      s.setData({
        show: false
      })
    }
  },

  addClick: function() {
    this.setData({
      amount: this.data.amount + 1,
      totalPrice: this.data.sellPrice * (this.data.amount + 1)
    })
  },

  minusClick: function() {
    if (this.data.amount > 1) {
      this.setData({
        amount: this.data.amount - 1,
        totalPrice: this.data.sellPrice * (this.data.amount - 1)
      })
    } else {
      return false;
    }
  },

  addToCart: function() {
    var that = this;
    if (that.data.token == "") {
      wx.showModal({
        title: '未登录',
        content: '是否现在登录',
        confirmColor: '#4aa7fa',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    if (that.data.productTypeId == '') {
      wx.showModal({
        title: '提示',
        content: '请先选择类型',
        confirmColor: '#4aa7fa',
        showCancel: false
      })
      return false;
    }
    var data = {
      "number": that.data.amount,
      "productId": that.data.productId,
      "productTypeId": that.data.productTypeId
    };
    wx.request({
      url: webhost + "shop/addShop",
      data: data,
      header: {
        token: that.data.token
      },
      method: 'POST',
      success: function(res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '加入成功~'
            })
            that.setData({
              show: false
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
  },

  typeClick: function(e) {
    var that = this;
    var productTypeId = e.currentTarget.dataset.id;
    var price = +e.currentTarget.dataset.price;
    var memo = e.currentTarget.dataset.memo;
    that.setData({
      productTypeId: productTypeId,
      sellPrice: price,
      totalPrice: price * that.data.amount,
      selectMemo: memo
    })
  },

  // 立即购买
  buyClick: function() {
    var that = this;
    if (that.data.token == "") {
      wx.showModal({
        title: '未登录',
        content: '是否现在登录',
        confirmColor: '#4aa7fa',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    if (that.data.productTypeId == '') {
      wx.showModal({
        title: '提示',
        content: '请先选择类型',
        confirmColor: '#4aa7fa',
        showCancel: false
      })
      return false;
    }
    var dataList = [{
      'productId': that.data.productId,
      'banner': that.data.banner,
      'number': that.data.amount,
      'memo': that.data.memo,
      'price': that.data.sellPrice,
      'freight': that.data.freight,
      'productTypeId': that.data.productTypeId,
      'typeName': that.data.typeName
    }]
    console.log(dataList);
    var data = JSON.stringify(dataList);
    wx.navigateTo({
      url: '../cart/buy?data=' + data
    })
  },

  onLoad: function(options) {
    var that = this;

    if (options.id) {
      that.setData({
        productId: options.id
      })
    }

    getDetail = () => {
      var data = {

      };
      wx.request({
        url: webhost + "toDetail?id=" + that.data.productId,
        data: data,
        method: 'GET',
        success: function(res) {
          switch (+res.data.code) {
            // case 0:
            default: that.setData({
              banner: res.data.banner,
              cases: res.data.cases,
              freight: res.data.freight,
              logisticMemo: res.data.logisticMemo,
              material: res.data.material,
              maxMoney: res.data.maxMoney,
              memo: res.data.memo,
              minMoney: res.data.minMoney,
              place: res.data.place,
              price: res.data.price,
              productId: res.data.productId,
              size: res.data.size,
              title: res.data.title,
              types: res.data.types
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

    getDetail();
  },

  onShow: function() {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
    } else {
      that.setData({
        token: ''
      })
    }
  },

  onShareAppMessage: function() {

  }
})