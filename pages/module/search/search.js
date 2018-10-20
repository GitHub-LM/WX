//index.js
const app = getApp()
const http = require('../../../js/http.js')

Page({
  data: {
    items: [],
    keyword:''
  },
  onShow: function() {

  },
  searchGoods: function(e) {
    
    this.setData({
      keyword: e.detail.value
    });
    var that = this;
    var data = {};
    var cache = Math.random(15);
    data.keyword = this.data.keyword;
    data._cache = cache;
    wx.request({
      url: app.globalData.url + '/goods/down_list_option',
      method: "GET",
      data: data,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            items: res.data.data
          })
        }
      }
    })
  },
  search:function(){
    this.goodsList();
  },
  goodsList:function(){
    var keywords = this.data.keyword;
    if (keywords != ""){
      wx.navigateTo({
        url: '../../module/goodsList/goodsList?keywords=' + keywords,
      })
    }else{
      wx.showToast({
        title: '请输入关键词',
        duration:1000,
        image:"../../../img/error.png"
      })
    }
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
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
});