const app = getApp()
var webhost = app.globalData.webhost;
var getUser;

Page({
  data: {
    mobile: '',
    headImg: '',
    account: '',
    name: '',
    company: '',
    sex: 0,
    sexList: ['女', '男'],
    setName: '',
    setCompany: '',
    show1: false,
    show2: false
  },

  setname: function(e) {
    this.setData({
      setName: e.detail.value
    })
  },

  setcompany: function(e) {
    this.setData({
      setCompany: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    var that = this;
    that.setData({
      sex: +e.detail.value
    })
    wx.request({
      url: webhost + "user/updateSex/" + that.data.sex,
      data: {},
      header: {
        token: that.data.token
      },
      method: 'GET',
      success: function(res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '修改性别成功'
            })
            getUser();
            break;
          case 401:
            wx.showModal({
              title: '用户已过期',
              confirmColor: '#4aa7fa',
              content: '请重新登录',
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
  },

  showClick1: function() {
    var s = this;
    if (!s.data.show1) {
      s.setData({
        show1: true
      })
    } else {
      s.setData({
        show1: false
      })
    }
  },

  showClick2: function() {
    var s = this;
    if (!s.data.show2) {
      s.setData({
        show2: true
      })
    } else {
      s.setData({
        show2: false
      })
    }
  },

  setImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: './avatar?src=' + src,
        })
      }
    })
  },

  //修改名称
  setName: function() {
    var that = this;
    wx.request({
      url: webhost + "user/updateName/" + that.data.setName,
      data: {},
      header: {
        token: that.data.token
      },
      method: 'GET',
      complete: function () {
        that.setData({
          show1: false
        })
      },
      success: function(res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '修改成功'
            })
            getUser();
            break;
          case 500:
            wx.showToast({
              title: '修改失败'
            })
            break;
        }
      }
    })
  },

  //修改公司
  setFirm: function() {
    var that = this;
    wx.request({
      url: webhost + "user/updateCompany/" + that.data.setCompany,
      data: {},
      header: {
        token: that.data.token
      },
      method: 'GET',
      complete: function(){
        that.setData({
          show2: false
        }) 
      },
      success: function (res) {
        switch (+res.data.code) {
          case 0:
            wx.showToast({
              title: '修改成功'
            })
            getUser();
            break;
          case 500:
            wx.showToast({
              title: '修改失败'
            })
            break;
        }
      }
    })
  },


  LogoutClick: function() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录？',
      confirmColor: '#4aa7fa',
      success: function(res) {
        if (res.confirm) {
          app.globalData.token = '';
          console.log(app.globalData)
          wx.clearStorage();
          wx.switchTab({
            url: '../index/index'
          })
        }
      }
    })
  },

  onLoad: function(options) {
    var that = this;

    getUser = () => {
      wx.request({
        url: webhost + "user/getUserInfo",
        data: {},
        header: {
          token: that.data.token
        },
        method: 'GET',
        success: function(res) {
          switch (+res.data.code) {
            case 0:
              that.setData({
                mobile: res.data.data.account,
                headImg: res.data.data.picture,
                account: res.data.data.account,
                name: res.data.data.name,
                company: res.data.data.company,
                sex: res.data.data.sex,
                setName: res.data.data.name,
                setCompany: res.data.data.company
              })
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


  onShow: function() {
    var that = this;
    if (app.globalData.token != '') {
      that.setData({
        token: app.globalData.token
      })
      getUser();
    } else {
      that.setData({
        token: ''
      })
    }
  }
})