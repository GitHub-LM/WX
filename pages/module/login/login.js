//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
const http = require('../../../js/http.js')
const storage = require('../../../js/storage.js');


Page({
  data: {
    hiddenName: false,
    forgetName:true,
    username: "",
    password: "",
    mobile: '',
    userInfo: {},
    prePage:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  register: function () {
  },
  mobileInput:function(e){
    this.setData({
      mobile: e.detail.value
    })  
  },
  psInput:function(e){
    this.setData({
      password: e.detail.value
    }) 
  },
  login:function(e){
    var that=this;
    var mobile = this.data.mobile;
    var password = this.data.password;
    var _cache = Math.random(15);
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
      })
      return false; 
    } else if (mobile.length != 11 && !myreg.test(mobile)) {
      wx.showToast({
        title: '手机号格式有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(mobile)){
      wx.showToast({
        title: '手机号格式有误！',
        icon: 'success',
        duration: 1500
      })
      return false;  
    } else{    
      //登录
      if (password==''){
        wx.showToast({
          title: '密码不能为空！',
          icon: 'success',  
          duration: 1500
        })
        return false;  
      }
      wx.request({
        url: app.globalData.url +"/user/user_login",
        data: {
          "loginName":"18574161943",
          "password":"abc12345"
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          // that.setData({
          //   userName: res.data.data.userName
          // })    
          var s = res.data
          if(s.code==0){
            if (s.data.dealerType == 1) {             
            } else {
              wx.setStorageSync('cookieId', s.data.cookieId);
              app.globalData.header.cookieId = s.data.cookieId
              storage.put("cookieId", s.data.cookieId);
              storage.put("cartNum", s.data.cartNum);
              console.log(that.data.prePage);
              var cc = that.data.prePage.split("/")[2];
              if (cc == "my" || cc == "sort" || cc == "cart" || cc == "index"){
                wx.switchTab({
                  url: "../../../" + that.data.prePage
                })
              }else{
                // wx.navigateTo({
                //   url: "../../../" + that.data.prePage
                // })

                wx.navigateBack({
                  delta: 1
                })

              }
            }
          }else{
            wx.showToast({
              title: "账户或密码不正确",
              icon: 'success',
              duration: 1500,
              width:120
            })
          }
        }
      })


    }
    return true;  
  },
  //事件处理函数
  bindViewTap: function () {  
    wx.navigateTo({
      url: ''
    })
  },
  onLoad: function (options) {
    /* 记录上一个页面来源*/
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    console.log( prevpage.route.split("/")[2])

    this.setData({
      prePage: prevpage.route
    })

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
    };

    // 登陆注册
    wx.login({//login流程
      success: function (res) {//登录成功
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              console.log(res2);
              var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
              var iv = res2.iv;
              //请求自己的服务器
              Login(code, encryptedData, iv);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
