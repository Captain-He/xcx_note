const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
    var that = this;
    const a = app.globalData.text;
    var text = '';
    for (let i = 0; i < a.length; i++) {
      if (a[i].name == 'img') {
        text += '<img class="xing-img" style="width: 100%" src="' +
          a[i].attrs.src + '"_height = "0.61983" _uploaded = "true" ></img>';
      } else {
        text += '<p class="xing-p">' + a[i].children[0].text + '</p>';
      }
    }
    that.setData({
      html: text
    })
  },

  finish: function (e) {

  },
})
