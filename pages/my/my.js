//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  brandclick: function (event) {
    // 跳转到tabBar页面（在app.json中注册过的tabBar页面），同时关闭其他非tabBar页面。
    console.log("123")
    wx.switchTab({
      //目的页面地址
      url: '../module/login/login', 
    })
  },
  out:function(){
    var a = Math.random(15);
    var that=this;
    wx.request({
      url: app.globalData.url + '/user/saasLoginOut/',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data:{
      },
      success: function (res) {
        console.log(res)
        wx.setStorageSync("cookieId","")
        wx.setStorageSync("cartNum", "") 
        that.setData({
          hasUserInfo: false,
        })   
      }
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../sort/sort'
    })
  },
  onShow:function(){
    var that=this
    wx.getStorageSync("cookieId")
    if (wx.getStorageSync("cookieId") == "") {
      console.log("未登录")
    } else {
      console.log("已登录")
      that.setData({
        hasUserInfo: true
      })
    }
  },
  onLoad: function () {
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
