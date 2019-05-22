//main.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title: [],
    imgUrls: [],
    author: '',
    date: [],
    requestUrl: "top",
    cssActive: 0,
    dataId: 0,
    windowHeight: "",
    windowWidth: "",
    page: 0,
    contenturl:[],
    time:[]
  },
  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullDownRefresh: function (e) {
    console.log("下拉刷新");
    this.onLoad();
  },
  pullUpLoad: function (e) {
    app.page += 5;
    this.setData({
      page: app.page
    })
    console.log("上拉加载" + app.page);
    this.loading();
    this.getTypeData(app.page);
  },
  check: function (e) {
    // console.log(e.target.dataset.id);
    // console.log(e.target.id);
    app.cssActive = e.target.dataset.id
    app.requestUrl = e.target.id;
    this.resetData();
    this.setData({
     // dataId: app.cssActive,
      title: app.title,
      imgUrls: app.imgUrls,
     // author: app.author,
      date: app.date,
    //  requestUrl: app.requestUrl,
      page: app.page
    }),
      this.loading();
    this.getTypeData(app.page);
  },
  onLoad: function () {
    this.resetData();
    this.loading();
    this.getTypeData(app.page);
    this.setData({
      modalHidden: true
    })
  },
  getTypeData: function (page) {
    wx.request({
      url: 'https://www.caption-he.com.cn/xcx/home/index/getnewsid',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        // success
          
        var data = res.data;
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
          app.title[i] = data[i].title;
          app.imgUrls[i] = 'https://www.caption-he.com.cn'+data[i].thumbnail;
          app.author ='司马迁迁';
          app.date[i] = data[i].aid;
          app.time[i] = this.time(data[i].t *1000);
        }
        //   console.log( app.imgUrls );
        this.setData({
          title: app.title,
          imgUrls: app.imgUrls,
          author: '司马迁迁',
          date: app.date,
          contenturl: app.contenturl,
          time:app.time
          //page: app.page
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    })
  },
  time:function (timestamp) {
    var date = new Date(timestamp);
   var y = date.getFullYear() + '-';
    var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var d = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
   var  h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
   var  s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return y + m + d + h + m + s;
  },
  resetData: function () {
    app.title = [];
    app.imgUrls = [];
    app.author = '';
    app.title = [];
    app.date = [];
    app.page = 0;
    app.contenturl = [];
    app.time = []
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
})
