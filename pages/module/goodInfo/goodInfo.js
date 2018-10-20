// pages/module/goodInfo/goodInfo.js
const util = require('../../../utils/util.js')
const http = require('../../../js/http.js')
const pubFun = require('../../../js/public.js')
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
    var id = JSON.parse(options.id);
    var that = this
    var cookieId=wx.getStorageSync("cookieId");
    var cache=Math.random(15);
   // console.log(options, cookieId, id);

    wx.request({
      url: app.globalData.url + '/goods/web_item/info/' + id +"?_cache="+cache,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + cookieId
      },
      data: {
        cookieId: cookieId
      },
      success: function (res) {
        var s = res.data.data;
        if(s != undefined){
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
            sellerGoodsId: s.saleGId
          });
        }
      }
    })
  },
  cart: function () {
   var loginFlag= wx.getStorageSync("cookieId");
    if (!loginFlag.length){
      wx.navigateTo({
        url: '../login/login'
      })
    }else{
      this.setData({ flag: false })
    }
  },
  /* 数量减 */
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
  /* 数量加 */
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
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
  to_cart: function (e) {
    var that = this;
    var id = this.data.sellerGoodsId;
    var num = this.data.num
    pubFun.addCart(id,num);
   
    // var cartNum = wx.getStorageSync('cartNum');
    // console.log(cartNum)
    // that.setData({
    //       flag: true,
    //        cart_num: cartNum
    //     })

    wx.getStorage({
      key: 'cartNum',
      success:function(res){
        console.log(res)
         that.setData({
          flag: true,
           cart_num: res.data
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var aa=wx.getStorageSync("cartNum");
    wx.getStorage({
      key: 'cartNum',
      success: function (res) {
        console.log(res.data)
      }
    })

    if(aa != ""){
      this.setData({
        cart_num: aa
      })
    }else{
      this.setData({
        cart_num: "空"
      })
    }
   
  },
})