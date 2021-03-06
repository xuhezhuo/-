const app = getApp()
var webhost = app.globalData.webhost;
var getDetail;

Page({
  data: {
    token: '',
    userId: '',
    productId: '',
    banner: '',
    cases: [],
    freight: '',
    logisticMemo: '',
    material: '',
    maxMoney: '',
    memo: '',
    typeT: 0,
    discuss: '',
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
    if (this.data.typeT == 2) {
      return false;
    }
    this.setData({
      amount: this.data.amount + 1,
      totalPrice: this.data.sellPrice * (this.data.amount + 1)
    })
  },

  minusClick: function() {
    if (this.data.typeT == 2) {
      return false;
    }
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
    if (that.data.typeT == 2) {
      wx.showModal({
        title: '提示',
        content: '价格面议，请联系客服',
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
    var discuss = e.currentTarget.dataset.discuss;
    var typeT = +e.currentTarget.dataset.type;
    if(typeT == 2){
      that.setData({
        productTypeId: productTypeId,
        selectMemo: memo,
        discuss: discuss,
        typeT: typeT
      })
    } else{
      that.setData({
        productTypeId: productTypeId,
        sellPrice: price,
        totalPrice: price * that.data.amount,
        selectMemo: memo,
        discuss: discuss,
        typeT: typeT
      })
    }
   
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
    if(that.data.typeT == 2){
      wx.showModal({
        title: '提示',
        content: '价格面议，请联系客服',
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
      if (that.data.userId != '') {
        data.userId = that.data.userId
      }
      wx.request({
        url: webhost + "toDetail?id=" + that.data.productId,
        data: data,
        method: 'GET',
        complete: function(res){
          console.log(res);
        },
        success: function(res) {
          switch (+res.data.code) {
            // case 0:
            default: 
              that.setData({
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
              for (var i = 0; i < res.data.types.length; i++){
                if (res.data.types[i].type == 2){
                  that.setData({
                    typeT: 2,
                    discuss: '面议'
                  })
                  break;
                }
              }
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
  },

  onShow: function() {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token,
        userId: app.globalData.userId
      })
    } else {
      that.setData({
        token: ''
      })
    }
    getDetail();    
  },

  onShareAppMessage: function() {

  }
})