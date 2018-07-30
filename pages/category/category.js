const app = getApp()
var webhost = app.globalData.webhost;
var listProduct;
var listDevice;
var listTech1;
var listTech2;
var listTech3;
var listTech4;

Page({
  data: {
    height: '',
    active: 0,
    top: 43,
    toView: '',
    scroll: false,
    productList: [],
    deviceList: [],
    techList1: [],    
    techList2: [],    
    techList3: [],    
    techList4: []    
  }, 

  MorePClick: function(){
    wx.navigateTo({
      url: '../index/listProduct'
    })
  },

  openItemWin: e => {
    var keyword = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../index/listItem?keyword=' + keyword + "&title=" + title
    })
  },

  openProductDetailWin: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './detail?id=' + id
    })
  },

  openDetailWin: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../index/itemDetail?id=' + id
    })
  },

  tab: function (e) {
    var that = this;
    var tab = +e.currentTarget.dataset.tab;
    switch (tab) {
      case 0:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 43,
          active: 0,
          toView: 'product'
        });
        that.setData({
          scroll: false
        });
        break;
      case 1:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 146,
          active: 1,        
          toView: 'device'
        });
        that.setData({
          scroll: false
        });
        break;
      case 2:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 244,
          active: 2,          
          toView: 'drain'
        });
        that.setData({
          scroll: false
        });
        break;
      case 3:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 343,
          active: 3,          
          toView: 'feedWater'
        });
        that.setData({
          scroll: false
        });
        break;
      case 4:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 444,
          active: 4,        
          toView: 'tunnel'
        });
        that.setData({
          scroll: false
        });
        break;
      case 5:
        that.setData({
          scroll: true
        });
        that.setData({
          top: 540,
          active: 5,
          toView: 'others'
        });
        that.setData({
          scroll: false
        });
        break;
    }
  },

  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })

    listProduct = () => {
      var data = {
        "keywords": "",
        "page": "1",
        "size": "10",
        "type": 1
      };
      wx.request({
        url: webhost + "product/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                productList: res.data.data
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

    listDevice = () => {
      var data = {
        "keywords": "",
        "page": "1",
        "size": "10",
        "type": 2
      };
      wx.request({
        url: webhost + "product/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                deviceList: res.data.data
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

    listTech1 = () => {
      var data = {
        "keywords": "",
        "page": '1',
        "size": '10',
        "type": 'PS'
      }
      wx.request({
        url: webhost + "skill/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                techList1: res.data.data
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

    listTech2 = () => {
      var data = {
        "keywords": "",
        "page": '1',
        "size": '10',
        "type": 'GS'
      }
      wx.request({
        url: webhost + "skill/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                techList2: res.data.data
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

    listTech3 = () => {
      var data = {
        "keywords": "",
        "page": '1',
        "size": '10',
        "type": 'SD'
      }
      wx.request({
        url: webhost + "skill/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                techList3: res.data.data
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

    listTech4 = () => {
      var data = {
        "keywords": "",
        "page": '1',
        "size": '10',
        "type": 'QT'
      }
      wx.request({
        url: webhost + "skill/list",
        data: data,
        method: 'POST',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                techList4: res.data.data
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

  onReady: function () {
  
  },

  onShow: function () {
    var that = this;
    listProduct();
    listDevice();
    listTech1();
    listTech2();
    listTech3();
    listTech4();
  },

 
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})