// index.js
// 日记聚合页

var app = getApp();

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
    this.getDiaries();
  },

  /**
   * 获取日记列表
   * 目前为本地缓存数据 + 本地假数据
   * TODO 从服务端拉取
   */
  getDiaries() {
    var that = this;
    var backdata = Array();
      wx.request({
        url: 'https://www.caption-he.com.cn/xcx/home/index/search',
        method: 'GET',
        header: { 'content-type': 'application/json' },
        data: {
        },
        success: function (res) {
          //var reback = res.data;

          var list = res.data;
          console.log(list);
          wx.setStorageSync('list', list);
          that.setData({ diaries: list});
         // console.log(res.data);
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
