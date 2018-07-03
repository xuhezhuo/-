const app = getApp()
var webhost = app.globalData.webhost;
var getAddress;

Page({
  data: {
    region: ['福建省', '厦门市', '思明区'],
    receiver: '',
    phone: '',
    address: '',
    addressId: ''
  },

  setReceiver: function (e) {
    this.setData({
      receiver: e.detail.value
    })
  },

  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  setAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

  setClick: function(){
    var that = this;
    var data = {
      "address": that.data.address,
      "addressId": "",
      "province": that.data.region[0],
      "city": that.data.region[1],
      "area": that.data.region[2],
      "phone": that.data.phone,
      "street": '',
      "receiver": that.data.receiver
    };
    wx.request({
      url: webhost + "address/save?token=" + that.data.token,
      data: data,
      method: 'POST',
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '新增成功'
            })
            setTimeout(function () {
              wx.navigateBack({
                url: './listAddress'
              })
            }, 1200)
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
  },

  delClick: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址？',
      confirmColor: '#4aa7fa',
      success: function(res){
        if(res.confirm){
          var data = {

          };
          wx.request({
            url: webhost + "address/delete/" + that.data.addressId,
            data: data,
            method: 'GET',
            header: {
              token: that.data.token
            },
            success: function (res) {
              switch (+res.data.code) {
                case 0:
                  wx.showToast({
                    title: '删除成功'
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      url: './listAddress'
                    })
                  }, 1200)
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
      }
    })
  },

  onLoad: function (options) {
    var that = this;

    if(options.id){
      that.setData({
        addressId: options.id
      })
    }

    getAddress = () => {
      var data = {
       
      };
      wx.request({
        url: webhost + "address/get/" + that.data.addressId,
        data: data,
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function (res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                receiver: res.data.data.receiver,
                phone: res.data.data.phone,
                address: res.data.data.address,
                region: [res.data.data.province, res.data.data.city, res.data.data.area]
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
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      getAddress();          
    } else {
      that.setData({
        token: ''
      })
    }
  }
})