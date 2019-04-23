// pages/test/test.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  login:function(){
    wx.login({
      success: function (res) {
        var code = res.code;//发送给服务器的code
        console.log('1');
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
          data:{
            appid:'wxe414a8d62204cc8b',
            secret:'cee99d299baa43f5395faa74ba77cad8',
            js_code: code,
            grant_type: 'authorization_code'
          },
          success(v){
            console.log('2');
            //console.log(v.data.openid)
            wx.setStorageSync('openid', v.data.openid);
          }
        })
        wx.getUserInfo({
          success: function (res) {
            console.log('3');
            var userNick = res.userInfo.nickName;//用户昵称
            var avataUrl = res.userInfo.avatarUrl;//用户头像地址
            var gender = res.userInfo.gender;//用户性别
            var useropenid = wx.getStorageSync('openid');//
              wx.request({
                url: 'https://www.caption-he.com.cn/xcx/home/index/getuserinfo',//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
                method: 'GET',
                data: {
                  openid:useropenid,
                  nick: userNick,
                  avaurl: avataUrl,
                  sex: gender,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log('4');
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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