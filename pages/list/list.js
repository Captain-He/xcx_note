// index.js
// 日记聚合页

var app = getApp();
var page = 1;
Page({

  data: {
    // 日记列表
    // TODO 从server端拉取
    diaries: null,

    // 是否显示loading
    showLoading: false,

    // loading提示语
    loadingMessage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadmore();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    page = 1;
    that.setData({ diaries: []});
   that.loadmore();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    this.loadmore();
    console.log(page);
  },
  /**
   * 获取日记列表
   * 目前为本地缓存数据 + 本地假数据
   * TODO 从服务端拉取
   */
  loadmore:function() {
    var that = this;
    wx.showLoading({
      title: '正在加载中',
    })

    wx.request({
      url: 'https://www.caption-he.com.cn/xcx/home/index/search',//省略方法的路径
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      method:'POST',
      success: (res) => {
        wx.hideLoading();
        var list = res.data;
        var length = res.data.length;
        for (var i = 0; i < res.data.length; i++) {
          list[i] = res.data[i];
          wx.setStorageSync('list', list);
          that.setData({ diaries: list });
        }
      }
    })
  },

  // 查看详情
  showDetail(event) {
    wx.navigateTo({
      url: '../entry/entry?id=' + event.currentTarget.id,
    });
  }
})
