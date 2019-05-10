// index.js
// 日记聚合页

//const config = require("../../config");

var app = getApp();

Page({

  data: {
    // 日记列表
    // TODO 从server端拉取
    diaries: null,

    // 是否显示loading
    showLoading: false,

    // loading提示语
    loadingMessage: '',
    pdfs: [],
    titles: [],
    nickname: [],
    id: [],
    i:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if(this.data.i == 1)
      this.getDiaries();
  },
  onReachBottom(){
    var that = this;
    var list;
    if (this.data.i == 2) {
      var that = this;
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: 'https://www.caption-he.com.cn/xcx/home/index/search',
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: (res) => {
            wx.hideLoading();
            list = res.data;
            app.globalData.diaryList = list;
            typeof cb == 'function' && cb(app.globalData.diaryList)
            that.setData({ diaries: list });
          }
        })
    }
  },
  /**
 * 页面上拉触底事件的处理函数
 */

  /**
   * 获取日记列表
   * 目前为本地缓存数据 + 本地假数据
   * TODO 从服务端拉取
   */
  getDiaries() {
    var that = this;
    console.log('f');
    app.getDiaryList(list => {
      that.setData({ diaries: list });
      that.data.i = 2;
    })
  },

  // 查看详情
  showDetail(event) {
    var that = this;
    var t = this.data.diaries;

    for (var i = 0; i < t.length; i++) {
      that.data.id.push(t[i]['meta']['id']);
      that.data.titles.push(t[i]['meta']['title']);
      that.data.pdfs.push(t[i]['meta']['pdfurl']);
    }
    wx.navigateTo({
      url: '../entry/entry?id=' + event.currentTarget.id + '&pdfurl=' + this.data.pdfs[event.currentTarget.id] + '&title=' + this.data.titles[event.currentTarget.id] + '&ids=' + this.data.id[event.currentTarget.id],
    });
  }
})
