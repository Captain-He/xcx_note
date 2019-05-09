// components/xing-editor.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //图片上传相关属性，参考wx.uploadFile
    imageUploadUrl: String,
    imageUploadName: String,
    imageUploadHeader: Object,
    imageUploadFormData: Object,
    imageUploadKeyChain: String, //例：'image.url'

    //是否在选择图片后立即上传
    // uploadImageWhenChoose: {
    //   type: Boolean,
    //   value: false,
    // },

    //输入内容
    nodes: {
      type: Array,
      observer: 'insertNodesOrHtml',
    },
    html: {
      type: String,
      observer: 'insertNodesOrHtml',
    },

    //内容输出格式，参考rich-text组件，默认为节点列表
    outputType: {
      type: String,
      value: 'html',
    },

    buttonBackgroundColor: {
      type: String,
      value: '#409EFF',
    },

    buttonTextColor: {
      type: String,
      value: '#fff',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: 0,
    nodeList: [],
    textBufferPool: [],
    t:[],
    getInput:app.globalData.title
  },

  attached: function () {
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
    this.insertNodesOrHtml();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    insertNodesOrHtml: function () {
      let nodeList;
      if (this.properties.nodes && this.properties.nodes.length > 0) {
        nodeList = this.properties.nodes;
      } else if (this.properties.html) {
        nodeList = this.HTMLtoNodeList();
      }
      this.insertNodes(nodeList);
    },

    insertNodes: function (nodeList) {
      const textBufferPool = [];
      if (!nodeList) { return; }
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          textBufferPool[index] = node.children[0].text;
        }
      })
      this.setData({
        textBufferPool,
        nodeList,
      })
    },

    /**
     * 事件：添加文本
     */
    addText: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      const node = {
        name: 'p',
        attrs: {
          class: 'xing-p',
        },
        children: [{
          type: 'text',
          text: ''
        }]
      }
      const nodeList = this.data.nodeList;
      const textBufferPool = this.data.textBufferPool;
      nodeList.splice(index + 1, 0, node);
      textBufferPool.splice(index + 1, 0, '');
      this.setData({
        nodeList,
        textBufferPool,
      })
      app.globalData.li = index;
      app.globalData.text.splice(index + 1, 0, node);
      wx.navigateTo({
        url: '../../pages/virtualCamera/virtualCamera'
      })
    },
    /**
     * 事件：添加图片
     */
    addImage: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      wx.chooseImage({
        success: res => {
          const tempFilePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: tempFilePath,
            success: res => {
              const node = {
                name: 'img',
                attrs: {
                  class: 'xing-img',
                  style: 'width: 100%',
                  src: tempFilePath,
                  _height: res.height / res.width,
                },
              }
              let nodeList = this.data.nodeList;
              let textBufferPool = this.data.textBufferPool;
              nodeList.splice(index + 1, 0, node);
              app.globalData.text.splice(index + 1, 0, node);
              textBufferPool.splice(index + 1, 0, tempFilePath);
              this.setData({
                nodeList,
                textBufferPool,
              })
            }
          })
        },
      })
    },

    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      let textBufferPool = this.data.textBufferPool;
      nodeList.splice(index, 1);
      app.globalData.text.splice(index, 1);
      textBufferPool.splice(index, 1);
      this.setData({
        nodeList,
        textBufferPool,
      })
    },

    /**
     * 事件：文本输入
     */
    onTextareaInput: function (e) {
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },
    /**
     * 事件：提交内容
     */
    onFinish: function (e) {
      var _this = this;
      if(e.detail.value.getInput == ''){
        wx.showToast({
          title: '请输入标题',
        })
        return;
      }
      wx.showLoading({
        title: '正在保存',
      })
      this.writeTextToNode();
      this.handleOutput();
      var a = app.globalData.text;
      var j = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i].name == 'img') {
          wx.uploadFile({
            url: 'https://www.caption-he.com.cn/xcx/home/index/uploadimg', // 仅为示例，非真实的接口地址
            filePath: a[i].attrs.src,
            name: 'file',
            formData: {
              user: 'test'
            },
            success(res) {
              app.globalData.text[i].attrs.src = res.data
              // do something
              if (j == a.length) {
                wx.request({
                  url: 'https://www.caption-he.com.cn/xcx/home/index/tomysql', // 仅为示例，并非真实的接口地址
                  data: {
                    d: app.globalData.text,
                    openid:wx.getStorageSync('openid'),
                    title:e.detail.value.getInput
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    
                    wx.hideLoading();
                    app.globalData.text = Array();
                    app.globalData.li = '';
                    console.log(res.data);
                  }
                })
              }
            }
          })
        }
        j++;
      }
      wx.reLaunch({
        url: '../../pages/list/list'
      })
    },
req:function(){
  
},
    /**
     * 方法：HTML转义
     */
    htmlEncode: function (str) {

    },


    /**
     * 方法：HTML转义
     */
    htmlDecode: function (str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&gt;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, "\"");
      s = s.replace(/<br>/g, "\n");
      return s;
    },

    /**
     * 方法：将缓冲池的文本写入节点
     */
    writeTextToNode: function (e) {
      const textBufferPool = this.data.textBufferPool;
      const nodeList = this.data.nodeList;
      if (!nodeList) { return; }
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          node.children[0].text = textBufferPool[index];
        }
      })
      this.setData({
        nodeList,
      })
    },

    /**
     * 方法：将HTML转为节点
     */
    HTMLtoNodeList: function () {
      let html = this.properties.html;
      let htmlNodeList = [];
      while (html.length > 0) {
        const endTag = html.match(/<\/[a-z0-9]+>/);
        if (!endTag) break;
        const htmlNode = html.substring(0, endTag.index + endTag[0].length);
        htmlNodeList.push(htmlNode);
        html = html.substring(endTag.index + endTag[0].length);
      }
      return htmlNodeList.map(htmlNode => {
        let node = { attrs: {} };
        const startTag = htmlNode.match(/<[^<>]+>/);
        const startTagStr = startTag[0].substring(1, startTag[0].length - 1).trim();
        node.name = startTagStr.split(/\s+/)[0];
        startTagStr.match(/[^\s]+="[^"]+"/g).forEach(attr => {
          const [name, value] = attr.split('=');
          node.attrs[name] = value.replace(/"/g, '');
        })
        if (node.name === 'p') {
          const endTag = htmlNode.match(/<\/[a-z0-9]+>/);
          const text = this.htmlDecode(htmlNode.substring(startTag.index + startTag[0].length, endTag.index).trim());
          node.children = [{
            text,
            type: 'text',
          }]
        }
        return node;
      })
    },

    /**
     * 方法：将节点转为HTML
     */
    nodeListToHTML: function () {

    },

    /**
     * 方法：上传图片
     */
    uploadImage: function (node) {
      return new Promise(resolve => {
        let options = {
          filePath: node.attrs.src,
          url: this.properties.imageUploadUrl,
          name: this.properties.imageUploadName,
        }
        if (this.properties.imageUploadHeader) {
          options.header = this.properties.imageUploadHeader;
        }
        if (this.properties.imageUploadFormData) {
          options.formData = this.properties.imageUploadFormData;
        }
        options.success = res => {
          const keyChain = this.properties.imageUploadKeyChain.split('.');
          let url = JSON.parse(res.data);
          if (!keyChain) { return; }
          keyChain.forEach(key => {
            url = url[key];
          })
          node.attrs.src = url;
          node.attrs._uploaded = true;
          resolve();
        }
        wx.uploadFile(options);
      })
    },

    gett: function (e) {
      var _that = this;
      app.globalData.title=e.detail.value;
      _that.setData({
        getInput: e.detail.value
      })
    },
    ready:function(){
      this.gett();
      console.log(app.globalData.title);
      console.log('dd');
    },
    /**
     * 方法：处理节点，递归
     */
    handleOutput: function (index = 0) {
      let nodeList = this.data.nodeList;
      if (index >= nodeList.length) {
        wx.hideLoading();
        if (this.properties.outputType.toLowerCase() === 'array') {
          this.triggerEvent('finish', { content: this.data.nodeList });
        }
        if (this.properties.outputType.toLowerCase() === 'html') {
          this.triggerEvent('finish', { content: this.nodeListToHTML() });
        }
        return;
      }
      const node = nodeList[index];

      if (node.name === 'img' && !node.attrs._uploaded) {
        this.uploadImage(node).then(() => {
        });
      } else {
        this.handleOutput(index + 1);
      }
    },
  }
})

