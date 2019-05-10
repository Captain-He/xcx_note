// pages/cut/cut.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageSrc: options.imgUrl,
      img: options.imgUrl,
      w:options.w,
      h:options.h
    })
  },
clickButton:function(e){
  wx.showLoading({
    title: '识别中',
  })
  //var iurl = this.data.img;
  wx.getStorage({
    key: 'pic',
    success: function(res) {
      wx.uploadFile({
        url: 'https://www.caption-he.com.cn/xcx/home/index/upload', // 仅为示例，非真实的接口地址
        filePath: res.data[0],
        name: 'file',
        formData: {  
        },
        success(res) {
          const data = res.data
          // do something
          wx.hideLoading();
          if(data){
            const node = {
              name: 'p',
              attrs: {
                class: 'xing-p',
              },
              children: [{
                type: 'text',
                text: data
              }]
            }
            const index = app.globalData.li;
            app.globalData.text.splice(index + 1, 1);
            app.globalData.text.splice(index + 1, 0, node);
            wx.showToast({
              title: '识别成功',
              icon: 'success',
              duration: 2000
            })
      wx.reLaunch({
        url: '../../pages/addtxt/addtxt'
      })
          }
          else{
            wx.showToast({
              title: '识别失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      })
    },
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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