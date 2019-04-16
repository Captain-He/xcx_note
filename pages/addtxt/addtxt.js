// pages/addtxt/addtxt.js
const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://www.caption-he.com.cn/xcx/home/index/read',
      data: {
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'post',
      success(res) {
        var date = res.data;
        if(date== null){
          that.setData({
            html: ''
          })
        }else{
          that.setData({
            html: date
          })
        }
      }
    })
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
