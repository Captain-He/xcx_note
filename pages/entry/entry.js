// entry.js

/*const toolbar = [
  '../../images/nav/download.png', '../../images/nav/fav.png',
  '../../images/nav/share.png', '../../images/nav/comment.png',
];*/
const app = getApp();

Page({
  data: {
    // 当前日志详情
    diary: undefined,

    // 右上角工具栏
    // toolbar: toolbar,

    // 图片预览模式
    previewMode: false,

    // 当前预览索引
    previewIndex: 0,

    // 多媒体内容列表
    mediaList: [],
    pdfurl :'',
    title:'',
    ids:''
  },

  // 加载日记
  getDiary(params) {
    console.log("Loading diary data...", params);
    var list = wx.getStorageSync('list');
    var id = params["id"], diary;
    if (typeof id === 'undefined') {
      diary = list[0];
    } else {
      diary = list[id];
    }


    this.setData({
      diary: diary,
    });
  },

  /**
  * 下载文件并预览
  */
  downloadFile: function (e) {
    var that = this;
    var fss = wx.getFileSystemManager();
        fss.readdir({
          dirPath: wx.env.USER_DATA_PATH,
          success: function (res) {
            var name = that.data.ids + '.pdf';
            for (let i = 0; i < res.files.length; i++) {
              if (name == res.files[i]) {
                wx.showToast({
                  title: '已经下载过了！',
                  icon: 'none',
                  duration: 2000
                })
                return;
              }
            }
            wx.showLoading({
              title: '下载中...',
            })
            wx.downloadFile({
              url: that.data.pdfurl,
              header: {},
              success: function (res) {
                var filePath = res.tempFilePath;
                var savepath = '';
                wx.saveFile({
                  tempFilePath: filePath,
                  success: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '保存成功',
                    })
                    savepath = res.savedFilePath;
                    var fs = wx.getFileSystemManager();
                    fs.rename({
                      oldPath: savepath,
                      newPath: wx.env.USER_DATA_PATH + '/' + that.data.ids + '.pdf',
                      success: function (res) {
                        savepath = wx.env.USER_DATA_PATH + '/' + that.data.ids + '.pdf'
                        wx.openDocument({
                          filePath: savepath,
                          fileType: 'pdf',
                          success: function (res) {
                            console.log('打开文档成功')
                          },
                          fail: function (res) {
                            console.log(res);
                          },
                          complete: function (res) {
                            console.log(res);
                          }
                        })
                      }
                    })
                  }
                })
              },
              fail: function (res) {
                console.log('文件下载失败');
              },
              complete: function (res) { },
            })
          }
        })
  },
  // 过滤出预览图片列表
  getMediaList() {
   
    if (typeof this.data.diary !== 'undefined' &&
      this.data.diary.list.length) {
      this.setData({
        mediaList: this.data.diary.list.filter(
          content => content.type === 'IMAGE'),
      })
    }
  },

  // 进入预览模式
  enterPreviewMode(event) {
    console.log(event.target.dataset.src);
    let url = event.target.dataset.src;
    let urls = this.data.mediaList.map(media => media.content);
    let previewIndex = urls.indexOf(url);
    this.setData({ previewMode: true, previewIndex:0});
  },

  // 退出预览模式
  leavePreviewMode() {
    this.setData({ previewMode: false, previewIndex: 0 });
  },

  onLoad: function (params) {
    this.setData({
      pdfurl:params.pdfurl,
      title:params.title,
      ids:params.ids
    });
   
    this.getDiary(params);
    this.getMediaList();
  },

  onHide: function () {
  },
})
