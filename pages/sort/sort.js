//logs.js
const util = require('../../utils/util.js')
const http = require('../../js/http.js')
const app = getApp()

Page({
  data: {
    notnow:"",
    isChecked: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //菜单详情
  meaus: function (e) {
    var that = this
    var kind = e.target.id
    //console.log(e.target.id)
    //var params = {}; //参数
    http.GET("http://gdbmro.com/gdbmro_serviceApi/category/getCates/?type=1&_cache=0.4135342619342768", function (res) {
      var datas = res.data.data;
      //console.log(datas)
      if (!kind == "") {
        for (var i = 0; i < datas.length; i++) {
          var data3 = datas[i].childrens//二级菜单
          for (var j = 0; j < data3.length; j++) {
            var data4 = data3[j].name
            var data5 = data3[j].childrens        
            if (kind == datas[i].id) {
              that.setData({
                _num: e.target.dataset.num,
                recommendData: datas[i].brand,
                twoList: datas[i].childrens,//二级菜单
                notnow: ""
              });
            }
          }
        }
      } else {
        that.setData({
          _num: e.target.dataset.num,
          recommendData:"",
          twoList: '',
         notnow:"暂无"
        });
      }
    }, function (e) {
      console.log("wrong");
    });
  },
  onShow: function () {
    // wx.switchTab({
    //   url: 'sort',
    //   success: function (e) {
    //     var page = getCurrentPages().pop();
    //     if (page == undefined || page == null) return;
    //     page.onLoad();
    //   }
    // })
  },
  onLoad: function (e) {
    

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
