const app = getApp()
var webhost = app.globalData.webhost;
var getLogistics;

Page({
  data: {
    company: '',
    num: '',
    itemList: [],
    state: '',
    len: 5,
    show: true
  },

  moreClcik: function(){
    this.setData({
      len: 100,
      show: false
    })
  },

  onLoad: function (options) {
    var that = this;

    if(options.num){
      that.setData({
        num: options.num
      })
    }

    getLogistics = () => {
      wx.showNavigationBarLoading();
      wx.request({
        url: webhost + "order/logistics/" + that.data.num,
        data: {},
        method: 'GET',
        header: {
          token: that.data.token
        },
        complete: function () {
          wx.hideNavigationBarLoading();
        },
        success: function (res) {
          // switch (+res.data.code) {
            // case 0:
              that.setData({
                company: res.data.company,
                itemList: res.data.data,
                state: res.data.state
              })
              // break;
            // case 401:
          //     wx.showModal({
          //       title: '未登录',
          //       content: '请先登录',
              // confirmColor: '#4aa7fa',
          //       success: (res) => {
          //         if (res.confirm) {
          //           wx.navigateTo({
          //             url: '../login/login'
          //           })
          //         }
          //       }
          //     })
          //     break;
          //   case 500:
          //     wx.showModal({
          //       title: '发现问题了',
          //       content: res.data.msg,
          //       showCancel: false,
          //       confirmColor: '#4aa7fa'
          //     })
          // }
        },
        fail: function (res) {
          that.setData({
            connect: false
          })
        }
      })
    }

    getLogistics();
  },

  onShow: function () {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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