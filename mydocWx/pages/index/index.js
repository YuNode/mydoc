//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //docs: [{ "doc_name": "Node.js" }, { "doc_name": "微信小程序开发" },]
    docs: [],
  },
  //事件处理函数
  select: function (event) {
    console.log(event.currentTarget.dataset.doc_name);
    var app = getApp()
    // Get the global data and change it.
    app.selectDocName = event.currentTarget.dataset.doc_name;
    wx.navigateTo({
      url: '../doc/doc'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      wx.request({
        url: 'http://localhost:3000/api/v1/docs', //仅为示例，并非真实的接口地址
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            docs: res.data
          })
        },
        fail() {
          wx.showToast({
            title: '数据加载失败',
            icon: 'fail',
            duration: 20000
          })
        }
      })
    })
  }
})
