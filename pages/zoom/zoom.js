// pages/zoom/zoom.js
//获取应用实例

var app = getApp()

Page({
  data: {
    msgList: [],
    height: 0,
    scrollY: true
  },
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 185, //消息列表项最大左滑距离
  correctMoveLeft: 175, //显示菜单时的左滑距离
  thresholdMoveLeft: 75,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  onLoad: function () {
  wx.showLoading({
    title: '加载中',
  })
    var that =this;
    this.pixelRatio = app.data.deviceInfo.pixelRatio;
    var windowHeight = app.data.deviceInfo.windowHeight;
    var height = windowHeight;
    var fs = wx.getFileSystemManager();
    var list = Array();
    var ji = 0;
    fs.readdir({
      dirPath: wx.env.USER_DATA_PATH+'/pdf',
      success: function (res) {
        list = res.files;
        console.log(list);
        if(list.length == 0)
        {
          wx.hideLoading();
          wx.showToast({
            title: '本地没有文档',
          })
        } else{
          for (let i = 0; i < list.length; i++) {
            var t = list[i].split('.');
            console.log(t['0']);
            wx.request({
              url: 'https://www.caption-he.com.cn/xcx/home/index/idsearch',
              data: {
                id: t['0']
              },
              success: function (res) {
                var msg = {};
                msg.carid = res.data.title;
                msg.msgText = res.data.nick + "   " + res.data.time;
                msg.id = list[i];
                msg.headerImg = res.data.imgurl;
                msg.siteImg = '../../images/site.png';
                if (res.data.length != 0)
                  that.data.msgList.push(msg);
                ji++;
                if (ji == list.length)
                  that.setData({ msgList: that.data.msgList, height: height });
                wx.hideLoading();
              }
            })
          }
        }

      }
    })

  },

  ontouchstart: function (e) {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.firstTouchX = e.touches[0].clientX;
    this.firstTouchY = e.touches[0].clientY;
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
    this.lastMoveTime = e.timeStamp;
  },

  ontouchmove: function (e) {
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    var moveX = e.touches[0].clientX - this.firstTouchX;
    var moveY = e.touches[0].clientY - this.firstTouchY;
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.swipeDirection === 2) {
      return;
    }
    //未触发滑动方向
    if (this.swipeDirection === 0) {
      console.log(Math.abs(moveY));
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.swipeDirection = 2;

        return;
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.swipeDirection = 1;
        this.setData({ scrollY: false });
      }
      else {
        return;
      }

    }
    //禁用垂直滚动
    // if (this.data.scrollY) {
    //   this.setData({scrollY:false});
    // }

    this.lastMoveTime = e.timeStamp;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.currentTarget.id, moveX, 0);
  },
  ontouchend: function (e) {
    this.swipeCheckState = 0;
    var swipeDirection = this.swipeDirection;
    this.swipeDirection = 0;
    if (this.touchStartState === 1) {
      this.touchStartState = 0;
      this.setData({ scrollY: true });
      return;
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      //不显示菜单状态下,激活垂直滚动
      this.setData({ scrollY: true });
      return;
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
      //不显示菜单,激活垂直滚动
      this.setData({ scrollY: true });
    }
    this.translateXMsgItem(e.currentTarget.id, this.moveX, 500);
    //this.translateXMsgItem(e.currentTarget.id, 0, 0);
  },
  onDeleteMsgTap: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个文档吗？',
      success:function(res){
        if(res.confirm){
          console.log(wx.env.USER_DATA_PATH + '/pdf/' + e.currentTarget.id);
          var fs = wx.getFileSystemManager();
          fs.rename({
            oldPath: wx.env.USER_DATA_PATH + '/pdf/' + e.currentTarget.id,
            newPath: wx.env.USER_DATA_PATH + '/pdf/' + '删.pdf',
            success: function (res) {
              that.deleteMsgItem(e);
              wx.showToast({
                title: '删除成功',
              })
            }
          })
        }else{}
      }
    })
  },
  onDeleteMsgLongtap: function (e) {
    console.log(e);
  },
  onMarkMsgTap: function (e) {
    var savepath = wx.env.USER_DATA_PATH + '/pdf/' + e.currentTarget.id;
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
  },
  onMarkMsgLongtap: function (e) {
    console.log(e);
  },
  getItemIndex: function (id) {
    var msgList = this.data.msgList;
    for (var i = 0; i < msgList.length; i++) {
      if (msgList[i].id === id) {
        return i;
      }
    }
    return -1;
  },
  deleteMsgItem: function (e) {
    console.log('hh');
    var animation = wx.createAnimation({ duration: 200 });
    animation.height(0).opacity(0).step();
    this.animationMsgWrapItem(e.currentTarget.id, animation);
    var s = this;
    setTimeout(function () {
      var index = s.getItemIndex(e.currentTarget.id);
      s.data.msgList.splice(index, 1);
      s.setData({ msgList: s.data.msgList });
    }, 200);
    this.showState = 0;
    this.setData({ scrollY: true });
  },
  translateXMsgItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'msgList[' + index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  animationMsgWrapItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'msgList[' + index + '].wrapAnimation';
    param[indexString] = animation.export();
    this.setData(param);
  },


})
