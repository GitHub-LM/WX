
const app = getApp();

/*
  HttpRequst封装
*/
module.exports = {
  HttpRequst(loading, url, sessionChoose, params, method,callBack) {
  if (loading == true) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
  }
  var paramSession = [{},
  { 'content-type': 'application/json', 'Cookie': "cookieId=" + wx.getStorageSync("cookieId") },
  { 'content-type': 'application/json' },
  { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': "cookieId=" + wx.getStorageSync("cookieId") },
  { 'content-type': 'application/x-www-form-urlencoded' }]
  wx.request({
    url: app.globalData.url + url,
    data: params,
    dataType: "json",
    header: paramSession[sessionChoose],
    method: method,
    success: function (res) {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
      callBack(res.data);
    },
    complete: function () {
      if (loading == true) {
        wx.hideToast();//隐藏提示框
      }
    }
  })
},

  /*
    加入购物车
  */
  addCart(id,num){
    //console.log("加入购物车");
    wx.getStorage({
      key: 'cookieId',
      success: function (res) {
        var data = {}, _cache = Math.random(15);
        data.sellerGoodsId = id;
        data.num = num;
        data.activityType = "0";
        data._cache = _cache;
        wx.request({
          url: app.globalData.url + "/cart/cart_add/",
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
          },
          success: function (res) {
            if (res.data.code == 0) {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 1500
              });
              //wx.setStorageSync("cartNum", res.data.data)

              wx.setStorage({
                key: "cartNum",
                data: res.data.data
              })
            }
          }
        })
      },
      fail: function (res) {
        wx.navigateTo({
          url: '../../module/login/login'
        })
      }
    })
    
  },
  checkTel:function(t){
    console.log(t);
    var reg = /(^([0\*][0-9\*]{2,3}\s)?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^([0\*][0-9\*]{2,3})?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^([0\*][0-9\*]{2,3}[\-\*])?([2-9\*][0-9\*]{6,7})+(\-[0-9\*]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?([1\*][34578\*][0-9\*]{9})$)/;

    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  checkPostcode: function (t) {
    var reg = /^[0-9][0-9]{5}$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
  checkAddress: function (t) {
    var reg = /^[\u4E00-\u9FA5A-Za-z\d\-\_\#\,\、\，\(\)\（\）\s]{1,60}$/;
    if (reg.test(t)) {
      return true;
    } else {
      return false;
    }
  },
}