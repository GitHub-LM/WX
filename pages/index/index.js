//index.js
const app = getApp()
const http = require('../../js/http.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onShow: function () {
    var that = this
    var http = require('../../js/http.js')
    var _catch=Math.random(15)
    //精选品牌
    wx.request({
      url: app.globalData.url + '/brand/hotBrand?_cache=' + _catch,
      method:"GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      success:function(res){
        var datas = res.data.data;
        that.setData({ removeData: datas });
      }
    })
    //轮播图
    wx.request({
      url: app.globalData.url + '/adverBanner/home_index/index',
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      success: function (res) {
        var datas = res.data.data;
        that.setData({ bannerimgs: datas });
      }
    })
  },
  to_ginfo: function(e){ 
    var p = JSON.stringify(e.currentTarget.dataset.id); 
    //console.log(p)
    if (wx.getStorageSync("cookieId") == "") {
      wx.navigateTo({ url: '../module/login/login' })
    } else {
      wx.navigateTo({ url: '../module/goodInfo/goodInfo?id=' + p })
    }
  },
  inpclick:function(){
    wx.navigateTo({
      url: '../module/search/search'
    })
  },
  toBrandList:function(e){
    var brandId = e.currentTarget.dataset.id;
    console.log(brandId);
    wx.navigateTo({
      url: '../module/goodsList/goodsList?brandId=' + brandId
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../sort/sort'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
