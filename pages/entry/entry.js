// entry.js
const app = getApp();
const toolbar = [
  '../../images/nav/download.png', '../../images/nav/fav.png',
  '../../images/nav/share.png', '../../images/nav/comment.png',
];
Page({
  data: {
    // 当前日志详情
    diary: undefined,

    // 右上角工具栏
    toolbar: toolbar,

    // 图片预览模式
    previewMode: false,

    // 当前预览索引
    previewIndex: 0,

    // 多媒体内容列表
    mediaList: [],
    pdfurl: '',
    title: '',
    ids: ''
  },

  // 加载日记
  getDiary(params) {
    console.log("Loading diary data...", params);
    var  diary;
    var id = params["id"];
    app.getDiaryList(list => {
      if (typeof id === 'undefined') {
        diary = list[0];
      } else {
        diary = list[id];
      }
    });

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
    var isexit = 9;
    fss.mkdir({
      dirPath: wx.env.USER_DATA_PATH+'/pdf',
      recursive:true,
      success:function(res){
        isexit = 1;
      },
      fail:function(res){
        isexit = 2;
        console.log(res);
      },
      complete:function(res){
        var path = wx.env.USER_DATA_PATH + '/pdf';
        if(isexit = 1||isexit == 2)
        {
          fss.readdir({
            dirPath: path,
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
                        newPath: wx.env.USER_DATA_PATH + '/pdf/' + that.data.ids + '.pdf',
                        success: function (res) {
                          savepath = wx.env.USER_DATA_PATH + '/pdf/' + that.data.ids + '.pdf'
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
          isexit = 9;
        }
      }
    })
  },
    /**
    * 删除
    */
    del:function(){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定要删除这个文档吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '删除中',
              icon: 'loading',
              duration: 2000
            })
            wx.request({
              url: 'https://www.caption-he.com.cn/xcx/home/index/del',
              data: {
                openid: wx.getStorageSync('openid'),
                id: that.data.ids
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'GET',
              success: (res) => {
                console.log(res.data+'g');
                if (res.data == 1) {
                  wx.hideToast();
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.hideToast();
                  wx.showToast({
                    title: '删除失败',
                    icon: 'loading',
                    duration: 2000
                  })
                  wx.hideToast();
                }

              },
              fail:function(res){
                wx.hideToast();
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          } else { }
        }
      })
    },
    //分享
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '懒人云笔记小程序',
      path: 'pages/entry/entry',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

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
    let url = event.target.dataset.src;
    let urls = this.data.mediaList.map(media => media.content);
    let previewIndex = urls.indexOf(url);

    this.setData({ previewMode: true, previewIndex });
  },

  // 退出预览模式
  leavePreviewMode() {
    this.setData({ previewMode: false, previewIndex: 0 });
  },

  onLoad: function (params) {
    this.getDiary(params);
    this.getMediaList();
    this.setData({
      pdfurl: params.pdfurl,
      title: params.title,
      ids: params.ids
    });
  },

  onHide: function () {
  },
})
