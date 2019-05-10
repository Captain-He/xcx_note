//app.js
//const config = require('config');
App({
  data: {
    // 设备信息，主要用于获取屏幕尺寸而做适配
    deviceInfo: null,

    // 本地日记缓存列表 + 假数据
    // TODO 真实数据同步至服务端，本地只做部分缓存
    

    // 本地日记缓存
    localDiaries: null,
  },
  onLaunch: function () {
    this.data.deviceInfo = wx.getSystemInfoSync();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 获取本地全部日记列表
  getDiaryList(cb) {
    var that = this;

    if (this.globalData.diaryList) {
      typeof cb == 'function' && cb(this.globalData.diaryList);
    } else {
      let list = [];
      this.getLocalDiaries(storage => {
        // 本地缓存数据
        for (var k in storage) {
          list.push(storage[k]);
        }
      });
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
          that.globalData.diaryList = list;
          typeof cb == 'function' && cb(that.globalData.diaryList)
        }
      })
      // 本地假数据

    }
  },

  // 获取本地日记缓存
  getLocalDiaries(cb) {
   
  },
  // 获取当前设备信息
  getDeviceInfo: function (callback) {
    var that = this;

    if (this.globalData.deviceInfo) {
      typeof callback == "function" && callback(this.globalData.deviceInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.deviceInfo = res;
          typeof callback == "function" && callback(that.globalData.deviceInfo)
        }
      })
    }
  },

  globalData: {
    diaryList: null,
    userInfo: null,
    text:[],
    li:'',
    title:'hh'
  }
})