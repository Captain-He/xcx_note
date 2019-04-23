// pages/addtxt/addtxt.js
const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
   // console.log( app.globalData.text+'FFFFFFF');   
      var that = this;
          that.setData({
            html: app.globalData.text
          })
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
