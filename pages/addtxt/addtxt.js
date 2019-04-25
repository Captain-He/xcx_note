const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
    var a = app.globalData.text;
    var text = '';
    for (let i = 0; i < a.length; i++) {
      if (a[i].name == 'img') {
        text += '<img class="xing-img" style="width: 100%" src="' +
          a[i].attrs.src + '"_height = "0.61983" _uploaded = "true" ></img>';
      } else {
        text += '<p class="xing-p">' + a[i].children.text + '</p>';
      }
    }
    this.setData({
      html: text
    })
   // app.globalData.text = '';
   // app.globalData.li = '';
  },

  finish: function (e) {
    console.log(e.detail.content);
  },
})
