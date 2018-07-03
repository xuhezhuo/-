const app = getApp()
var webhost = app.globalData.webhost;
var getCart;
var setNumber;
var count;

Page({
  data: {
    token: '',
    total: 0,
    totalPrice: 0,
    itemList: [],
    delWidth: 68 ,//删除按钮宽度单位（rpx）
    startX: 0,
    setting: false
  },

  Login: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },

  openDetailWin: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../category/detail?id=' + id
    })
  },

  plusClick: function(e){
    var that = this;
    if( that.data.setting){
      return false;
    }
    that.setData({
      setting: true
    })
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var amount = that.data.itemList[index].number + 1;
    setNumber(id, amount);
  },

  minusClick: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;    
    if (that.data.setting || that.data.itemList[index].number <= 1) {
      return false;
    }
    that.setData({
      setting: true
    })
    var id = e.currentTarget.dataset.id;
    var amount = that.data.itemList[index].number - 1;
    setNumber(id, amount);
  },

  del: function(e){
    var id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要移除该商品？',
      success: function(res){
        if(res.confirm){
          wx.request({
            url: webhost + "shop/app/del/" + id,
            data: {},
            method: 'POST',
            success: function (res) {
              switch (+res.data.code) {
                case 0:
                  wx.showToast({
                    title: '删除成功'
                  })
                  getCart();
                  break;
                case 401:
                  // wx.showModal({
                  //   title: '未登录',
                  //   content: '请先登录',
                  //   success: (res) => {
                  //     if (res.confirm) {
                  //       wx.navigateTo({
                  //         url: '../login/login'
                  //       })
                  //     }
                  //   }
                  // })
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
      }
    })
  },

  setCheck: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var itemList  = that.data.itemList;
    if(itemList[index].checked){
      itemList[index].checked = false;
    } else{
      itemList[index].checked = true;      
    }
    that.setData({
      itemList: itemList
    })
    count();    
  },

  buyClick: function(){
    var that = this;
    var list = that.data.itemList;
    var dataList = new Array();
    for(var i = 0; i < list.length; i++){
      if(list[i].checked){
        dataList.push(list[i]);
      }
    }
    var data = JSON.stringify(dataList);
    wx.navigateTo({
      url: './buy?data=' + data,
    })

  },

  //手指刚放到屏幕触发
  touchStart: function (e) {
    //判断是否只有一个触摸点
    this.setData({
      //记录触摸起始位置的X坐标
      startX: e.touches[0].clientX
    });
  },

  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    // console.log(e);
    // return false;
    var that = this
    //记录触摸点位置的X坐标
    var moveX = e.touches[0].clientX;
    //计算手指起始点的X坐标与当前触摸点的X坐标的差值
    var disX = that.data.startX - moveX;
    var index = e.currentTarget.dataset.index;
    var list = that.data.itemList;
    var delWidth = that.data.delWidth;
    
    if (list[index].left > delWidth){
      return false;
    }
    var left = 0;
    if (disX == 0) {//如果移动距离小于等于0，文本层位置不变
      return false;
    } else if (disX < 0){
      list[index].left = list[index].left + disX;
      if ( -disX >= delWidth) {
        //控制手指移动距离最大值为删除按钮的宽度
        list[index].left = 0;
      }
    } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
      list[index].left = disX;
      if (disX >= delWidth) {
        //控制手指移动距离最大值为删除按钮的宽度
        list[index].left = delWidth;
      }
    }
    //更新列表的状态
    that.setData({
      itemList: list
    });
  },

  touchE: function (e) {
    var that = this
      //手指移动结束后触摸点位置的X坐标
    var endX = e.changedTouches[0].clientX;
    //触摸开始与结束，手指移动的距离
    var disX = that.data.startX - endX;
    var delWidth = that.data.delWidth;
    var index = e.currentTarget.dataset.index;
    var list = that.data.itemList;
    if(disX == 0 ){
      return false;
    }

    //如果距离小于删除按钮的1/2，不显示删除按钮
    if (disX > (delWidth / 2) ){
      for (var i = 0; i < list.length; i++) {
        list[i].left = 0;
      }
      list[index].left = delWidth;
    } else{
      list[index].left = 0;      
    }
    // var left = disX > (delWidth / 2) ? delWidth : 0;
    //获取手指触摸的是哪一项
   
    //更新列表的状态
    that.setData({
      itemList: list
    });
  },

  onLoad: function (options) {
    var that = this;

    getCart = () => {
      wx.showNavigationBarLoading();      
      var data = {
        
      };
      wx.request({
        url: webhost + "shop/app/shopList",
        data: data,
        method: 'POST',
        header: {
          token: that.data.token
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              var list = res.data.data;
              var itemList = new Array();
              for(var i = 0; i < list.length; i++){
                var item = {};
                item.banner = list[i].banner;
                item.freight = list[i].freight;
                item.memo = list[i].memo;
                item.number = list[i].number;
                item.price = list[i].price;
                item.productId = list[i].productId;
                item.productTypeId = list[i].productTypeId;
                item.shopId = list[i].shopId;
                item.typeName = list[i].typeName;
                item.checked = 'true';
                item.left = 0;
                itemList.push(item);
              }
              that.setData({
                itemList: itemList
              })
              count();
              break;
            case 401:
              wx.showModal({
                title: '未登录',
                content: '请先登录',
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

    setNumber = (id , amount) => {
      wx.showNavigationBarLoading();
      var data = {

      };
      wx.request({
        url: webhost + "shop/updateNumber/" + id + "/" + amount,
        data: data,
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function (res) {
          wx.hideNavigationBarLoading();
          switch (+res.data.code) {
            case 0:
              that.setData({
                setting: false
              })
              getCart();
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
        }
      })
    }

    count  =  () => {
      var list = that.data.itemList;
      var total = 0;
      var totalPrice = 0;
      for( var i = 0; i < list.length; i++){
        if (list[i].checked){
          total += list[i].number;
          totalPrice += list[i].price * list[i].number;
        }
      }
      that.setData({
        total: total,
        totalPrice: totalPrice
      })
    }

  },

  onShow: function () {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      getCart();          
    } else {
      that.setData({
        token: ''
      })
    }
  },

  onPullDownRefresh: function () {
  
  }
})