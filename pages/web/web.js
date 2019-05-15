var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    date: "",
    time: "",
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.date
    })
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://www.caption-he.com.cn/xcx/home/index/getnews',
      method:'GET',
      data:{
        id:that.data.id
      },
      success:function(res){
        var article = res.data;
        WxParse.wxParse('article', 'html', article, that, 20);
      }
    })



      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */

  }
})