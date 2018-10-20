// pages/module/goodsList/goodsList.js
const app = getApp()
const pubFun = require('../../../js/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    pageNum: '1',
    keywords: '',
    brandId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)

    if (options.brandId) {
      this.setData({
        brandId: options.brandId
      })
      this.byIdList();
    } else {
      this.setData({
        keywords: options.keywords
      })
      this.byKeywordList();
    }

  },
  inpclick: function() {
    wx.navigateTo({
      url: '../../module/search/search'
    })
  },
  /**
   加入购物车
  */
  tocart: function(e) {
    var that=this;
    wx.getStorage({
      key: 'cookieId',
      success: function(res) {
        console.log(res.data);
        var id = e.currentTarget.dataset.id;
        var num= "1";
        pubFun.addCart(id,num);
      },
      fail: function(res) {
        console.log(that.data.keywords);
        wx.navigateTo({
          url: '../../module/login/login?' + that.data.keywords +"&"+ that.data.brandId,
        })
      }
    })
  },
  /*
   根据关键词加载商品列表
   */
  byKeywordList: function() {
    var that = this,
      data = {},
      cache = Math.random(15);
    var pageNum = that.data.pageNum;
    data.keyword = that.data.keywords;
    data._cache = cache;
    wx.request({
      url: app.globalData.url + '/goods/get_list/goods_list/' + pageNum,
      method: "GET",
      data: data,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      success: function(res) {
        if (res.data.code == 0) {
          var arr = that.data.searchList;
          for (var i = 0; i < res.data.data.searchList.length; i++) {
            arr.push(res.data.data.searchList[i]);
          }
          that.setData({
            searchList: arr
          })
        }
      }
    })
  },
  /*
   根据品牌ID加载商品列表
   */
  byIdList: function() {
    var that = this,
      data = {},
      cache = Math.random(15);
    var pageNum = that.data.pageNum;
    data.brandId = that.data.brandId;
    data._cache = cache;
    wx.request({
      url: app.globalData.url + '/goods/get_list/goods_list/' + pageNum,
      method: "GET",
      data: data,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      success: function(res) {
        if (res.data.code == 0) {
          var arr = that.data.searchList;
          for (var i = 0; i < res.data.data.searchList.length; i++) {
            arr.push(res.data.data.searchList[i]);
          }
          that.setData({
            searchList: arr
          })
        }
      }
    })
  },
  /**
  跳转到商品详情页
  */
  toDetail: function(e) {
    wx.navigateTo({
      url: '../../module/goodInfo/goodInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载数据',
      duration: 500
    });
    var pageNum = that.data.pageNum++;
    console.log(that.data.keywords, that.data.brandId)
    if (that.data.keywords != '') {
      that.byKeywordList();
    } else {
      that.byIdList();
    }

  },

})