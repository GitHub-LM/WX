const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    pubFun.HttpRequst("loading", '/receive_address/', 3, '', 'GET', that.addressList);
  },
  addressList: function (data) {
    console.log(data.data);
    var listArr=[];
    for (var i = 0; i < data.data.length;i++){
      var address = {};
      address.consigner = data.data[i].consignee;
      address.mobile = data.data[i].mobile;
      address.address = data.data[i].address;
      address.postCode = data.data[i].postCode;
      address.isDefault = data.data[i].isDefault;
      // 匹配省市区
      for (var m = 0; m < areas.areas.length; m++) {
        if (areas.areas[m].id == data.data[i].provinceId) {
          address.province = areas.areas[m].name;
        }
        if (areas.areas[m].pId == data.data[i].provinceId &&
          areas.areas[m].id == data.data[i].cityId) {
          address.city = areas.areas[m].name;
        }

        if (areas.areas[m].pId == data.data[i].cityId &&
          areas.areas[m].id == data.data[i].areaId) {
          address.area = areas.areas[m].name;
        }
      }
      listArr.push(address);
    }

    this.setData({
      addressList: listArr
    })
  },
  toAddress:function(){
    wx.navigateTo({
      url: '../../module/address/address',
    })
  },
  toEdit:function(e){
    var info = e.currentTarget.dataset.info;
    //console.log(info);
    wx.navigateTo({
      url: '../../module/editAddress/editAddress' +"?info="+JSON.stringify(info),
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
    this.onLoad()
  },


})