// pages/cart/cart.js
const app = getApp()
const http = require('../../js/http.js')


var GetList = function (that) {
  wx.request({
    url: app.globalData.url + '/cart/list?_cache=0.22500624180385986',
    method: "GET",
    header: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
    },
    data: {
      cookieId: wx.getStorageSync("cookieId")
    },
    success: function (res) {
      console.log(res)
      /* 判断购物车非空*/
      if (res.data.data != "") {
        var s = res.data.data[0];
        that.setData({
          hasList: true, // 有数据了，那设为true
          carts: s.list,
          name: s.name,
          selectAllStatus: true
        })
        that.getTotalPrice();
      } else {
        that.setData({
          hasList: false
        })
      }
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,   // 全选状态，默认全选
    deleteAllStatus: false,
    name: '',
    id: '',
    cut: false,
    edit: true
  },
  /*
    编辑
   */
  edit: function (e) {
    //console.log(this.data.carts)
    var a = this.data.carts;
    for (var i = 0; i < a.length; i++) {
      a[i].selected = false
      //console.log(a[i].selected) 
    }
    this.setData({
      cut: true,
      selectAllStatus: false,
      deleteAllStatus: true,
      edit: false
    })
    this.selectAll();
  },
  /*
    完成
   */
  done: function () {
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = false;
    }
    this.setData({
      cut: false,
      edit: true,
      selectAllStatus: true,
      deleteAllStatus: false
    })
    this.selectAll()
  },
  /**
    单选
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;

    if (carts[index].selected == false) {
      this.setData({
        selectAllStatus: false
      });
    } else {
      /* this.setData({
        selectAllStatus: true
      });  */
    }


    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  // deleteList(e) {
  //   const index = e.currentTarget.dataset.index;
  //   let carts = this.data.carts;
  //   carts.splice(index, 1);
  //   this.setData({
  //     carts: carts
  //   });
  //   if (!carts.length) {
  //     this.setData({
  //       hasList: false
  //     });
  //   } else {
  //     this.getTotalPrice();
  //   }
  // },
  /* 删除选中 */
  deleteCarts: function (e) {
    var that = this
    var s = this.data.carts;
    var arr = [];
    for (var i = 0; i < s.length; i++) {
      if (s[i].selected) {
        arr.push(s[i].id)
      }
    }
    wx.request({
      url: app.globalData.url + '/cart/del/',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        cookieId: wx.getStorageSync("cookieId"),
        cartId: arr
      },
      success: function (res) {
        GetList(that)
      }
    })
    console.log(arr);
  },
  /*
   全选删除
  */
  Alldelete: function () {
    let deleteAllStatus = this.data.deleteAllStatus;
    deleteAllStatus = !deleteAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = deleteAllStatus;
    }
    this.setData({
      deleteAllStatus: deleteAllStatus,
      selectAllStatus: deleteAllStatus,
      carts: carts,
    });
  },
  /*
   全选
   */
  selectAll(e) {
    //console.log(this.data)
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   加数量
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let id = this.data.carts[index].id;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    wx.request({
      url: app.globalData.url + '/cart/cart_add/',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        cookieId: wx.getStorageSync("cookieId"),
        id: id,
        num: carts[index].num,
        uNum: carts[index].num,
        _cache: 0.14486768392811755,
        activityType: 0
      },
      success: function (res) {
        wx.setStorageSync("cartNum", res.data.data)
      }
    })

    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 减数量
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let id = this.data.carts[index].id;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    wx.request({
      url: app.globalData.url + '/cart/cart_add/',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      data: {
        cookieId: wx.getStorageSync("cookieId"),
        id: id,
        _cache: 0.14486768392811755,
        num: carts[index].num,
        uNum: carts[index].num,
        activityType: 0
      },
      success: function (res) {
        console.log(res.data.data)
        wx.setStorageSync("cartNum", res.data.data)
      }
    })

    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {      // 循环列表得到每个数据
      if (carts[i].selected) {                    // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  toConfirm: function () {
    wx.navigateTo({
      url: '../module/confirm/confirm',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    if (wx.getStorageSync("cookieId")== "") {
      console.log("未登录")
      wx.redirectTo({
        url: '../module/login/login',
        success: function (res) { },
      })
      // wx.navigateBack({
      //   url: '../pages/index/index',
      // })
    } else {
      GetList(that);
    }
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