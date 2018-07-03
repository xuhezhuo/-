Page({
  data: {
  
  },

  call: function(){
    wx.makePhoneCall({
      phoneNumber: '15306004713',
    })
  },

  copyQQ: function(){
    wx.setClipboardData({
      data: '625342842',
      success: function(){
        wx.showToast({
          title: '已复制QQ',
        })
      }
    })
  },

  copyWechat: function () {
    wx.setClipboardData({
      data: '15306004713',
      success: function () {
        wx.showToast({
          title: '已复制微信',
        })
      }
    })
  },

  copyEmail: function () {
    wx.setClipboardData({
      data: '625342842@qq.com',
      success: function () {
        wx.showToast({
          title: '已复制邮箱',
        })
      }
    })
  },

  onLoad: function (options) {
  
  }
})