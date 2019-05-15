//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: '懒人云笔记',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  bindViewTap: function () {
      wx.switchTab({
        url: '/pages/news/news',
      });
  },
  onLoad: function () {

    this.login();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.login();
  },

  login: function () {
    wx.login({
      success: function (res) {
        var code = res.code;//发送给服务器的code
        console.log(code)
        wx.request({
          url: 'https://www.caption-he.com.cn/xcx/home/index/getopenid',
          data: {
            appid: 'wxe414a8d62204cc8b',
            secret: 'cee99d299baa43f5395faa74ba77cad8',
            js_code: code,
            grant_type: 'authorization_code'
          },
          success(v) {
            console.log(v.data)
            wx.setStorageSync('openid', v.data);
          }
        })
        wx.getUserInfo({
          success: function (res) {
            var userNick = res.userInfo.nickName;//用户昵称
            var avataUrl = res.userInfo.avatarUrl;//用户头像地址
            var gender = res.userInfo.gender;//用户性别
            var useropenid = wx.getStorageSync('openid');//
            wx.request({
              url: 'https://www.caption-he.com.cn/xcx/home/index/getuserinfo',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
              method: 'GET',
              data: {
                openid: useropenid,
                nick: userNick,
                avaurl: avataUrl,
                sex: gender,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                wx.setStorageSync('name', res.data.name);//将获取信息写入本地缓存
                wx.setStorageSync('imgUrl', res.data.imgurl);
                wx.setStorageSync('sex', res.data.sex);
              }
            })
          }
        })
      },
      fail: function (error) {
        console.log('login failed ' + error);
      }
    })
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});