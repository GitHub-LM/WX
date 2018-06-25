// pages/module/goodInfo/goodInfo.js
const util = require('../../../utils/util.js')
const http = require('../../../js/http.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    imgs: "",
    salePrice: '',
    orderNum: '',
    model: '',
    brandName: '',
    measure: '',
    num:1,
    flag: true,
    flag2: true,
    minusStatus: 'disabled',
    sellerGoodsId: "",
    cart_num:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var that = this
    wx.request({
      url: app.globalData.url + '/goods/web_item/info/' + id + '?_cache=0.9623878423793915',
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        cookieId: wx.getStorageSync("cookieId")
      },
      success: function (res) {
        var s = res.data.data
        console.log(s)
        that.setData({
          imgs: s.image,
          title: s.title,
          price: s.price,
          orderNum: s.orderNum,
          model: s.model,
          brandName: s.brandName,
          stock: s.stock,
          measure: s.measure,
          series: s.series,
          sellerGoodsId:s.saleGId
        });
      }
    })
  },
  cart: function () {
    this.setData({ flag: false })
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  /* 联系客服 */
  service:function(){
    this.setData({ flag2: false })
  },
  close_service:function(){
    this.setData({ flag2: true })
  },
  close:function(){
    this.setData({ flag: true })
  },
   /* 加入购物车 */
  to_cart:function(){
    var num = this.data.num
    var saleGId = this.data.sellerGoodsId
    var that=this
    console.log(num, saleGId)
    wx.request({
      url: app.globalData.url + '/cart/cart_add/',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        num: num,
        uNum: "0",
        activityType: "0",
        sellerGoodsId: saleGId,
        _cache: "0.24382888688142335"
      },
      success: function (res) {
        var s = res.data
        console.log(s)
        wx.setStorageSync("cartNum", s.data)
        that.setData({
           flag: true,
           cart_num: s.data
           })
      }
    })
  },
  cartPage:function(){
    wx.switchTab({
      url: '../../cart/cart'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var aa=wx.getStorageSync("cartNum")
    this.setData({
      cart_num:aa
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})