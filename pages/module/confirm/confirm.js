// pages/module/confirm/confirm.js
const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getConsigner:false,
    consignerInfo:'',
    province:'',
    city:'',
    area:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this,data={},cache=Math.random(15);
    data._cache = cache;
    wx.request({
      url: app.globalData.url + '/receive_address/',
      data: data,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({ getConsigner: true });
        if (res.data.data !=''){
          for (var i = 0; i < res.data.data.length;i++){
            if (res.data.data[i].isDefault == "1"){
              that.setData({
                consignerInfo: res.data.data[i]
              })
             
              // 匹配省市区
              for (var m = 0; m < areas.areas.length; m++) {
                if (areas.areas[m].id == that.data.consignerInfo.provinceId) {
                  console.log(areas.areas[m].name)
                  that.setData({
                    province: areas.areas[m].name
                  })
                }

                if (areas.areas[m].pId == that.data.consignerInfo.provinceId  && 
                  areas.areas[m].id == that.data.consignerInfo.cityId){
                  console.log(areas.areas[m].name)
                  that.setData({
                    city: areas.areas[m].name
                  })
                }

                if (areas.areas[m].pId == that.data.consignerInfo.cityId &&
                  areas.areas[m].id == that.data.consignerInfo.areaId) {
                  console.log(areas.areas[m].name)
                  that.setData({
                    area: areas.areas[m].name
                  })
                }

              }

             
            }
          }
          console.log(that.data.consignerInfo);
          
        }


      }
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
  
  },

  
})