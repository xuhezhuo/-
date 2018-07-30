const app = getApp()
var webhost = app.globalData.webhost;
var getBanner;
var getMsg;

Page({
  data: {
    bannerList: [],
    isMsg: false,
    newsList: [],    //行业动态
    consultList: []   //招标资讯
  },
 
  bannerClick: function(e){
    var linkType = e.currentTarget.dataset.linktype;
    var id = e.currentTarget.dataset.id;
    if(linkType == 'S') {
      wx.navigateTo({
        url: './itemDetail?id=' + id
      })
    } else if (linkType == 'P'){
      wx.navigateTo({
        url: '../category/detail?id=' + id
      })
    }
  },

  checkMsg: function(){
    var that = this;
    if( that.data.token == ""){
      wx.showModal({
        title: '未登录',
        content: '是否现在登录',
        confirmColor: '#4aa7fa',
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: '../my/listMsg'
    })
  },

  openItemWin: e => {
    var keyword = e.currentTarget.dataset.type;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: './listItem?keyword=' + keyword + "&title=" + title
    })
  },

  openActWin: () => {
    wx.navigateTo({
      url: './listAct',
    })
  },

  openNewsWin: () => {
    wx.navigateTo({
      url: './listNews',
    })
  },

  openlistHarmWin: e => {
    console.log(e);
    var keyword = e.currentTarget.dataset.type;    
    wx.navigateTo({
      url: './listHarm',
    })
  },

  openSearchWin: () =>{
    wx.navigateTo({
      url: './search'
    })
  },

  openProductWin: () => {
    wx.navigateTo({
      url: './listProduct'
    })
  },

  onLoad: function () {
    var that = this;
    
    getBanner = () =>{
      wx.request({
        url: webhost + "index",
        data: {
          
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                bannerList: res.data.data.bannerList,
                consultList: res.data.data.consultList, //咨询列表
                newsList: res.data.data.newsList  //动态列表
              })
              break;
            case 401:
              wx.showModal({
                title: '未登录',
                content: '请先登录',
                confirmColor: '#4aa7fa',
                success: (res) =>{
                  if(res.confirm){
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
    };
  
    getMsg = () => {
      wx.request({
        url: webhost + "message/hasUnread",
        data: {},
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              if (res.data.data) {
                that.setData({
                  isMsg: true
                })
              } else {
                that.setData({
                  isMsg: false
                })
              }
              break;
            case 401:
              wx.showModal({
                title: '用户已过期',
                content: '请重新登录',
                confirmColor: '#4aa7fa',
                success: (res) => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../login/login'
                    })
                  }
                }
              })
              break;
          }
        }
      })
    }

  },

  onShow: function(){
    var that = this;
    setTimeout(function(){
      if (app.globalData.token != '') {
        that.setData({
          token: app.globalData.token
        })
        getMsg();
      } else{
        that.setData({
          token: ''
        })
      }
    },200);
    getBanner();    
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '非开挖修复',
      path: '/pages/index/index'
    }
  }

})
