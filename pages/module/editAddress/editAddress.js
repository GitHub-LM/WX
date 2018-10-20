// pages/module/editAddress.js
const app = getApp();
const pubFun = require('../../../js/public.js');
const areas = require('../../../js/areas.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    areaInfo: '',
    consigner: '',
    mobile: '',
    provinces: [],
    citys: [],
    areas: [],
    provinceId: '',
    cityId: '',
    areaId: '',
    address: '',
    postCode: '',
    isDefault: 1,
    addressInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var addressInfo = JSON.parse(options.info);
    var that=this;
    that.setData({
      addressInfo: addressInfo
    })


  },
  /*
  收货人
  */
  consigner: function (e) {
    this.setData({
      consigner: e.detail.value
    })
  },
  /*
  手机号
  */
  mobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /*
  详细地址
  */
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  /*
  邮编
  */
  postCode: function (e) {
    this.setData({
      postCode: e.detail.value
    })
  },
  /*
    切换默认状态
  */
  switchChange: function (e) {
    if (e.detail.value == true) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
    //console.log(this.data.isDefault);
  },
  /*
   保存新增地址
   */
  savaAddress: function () {
    var that = this;
    //pubFun.checkTel(this.data.mobile);
    console.log(that.data.mobile);
    if (that.data.consigner == '') {
      wx.showToast({
        title: '收货人必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    };

    if (that.data.mobile == '') {
      wx.showToast({
        title: '手机号必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkTel(that.data.mobile)) {
      wx.showToast({
        title: '手机格式错误',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    };

    if (that.data.areaInfo == '') {
      wx.showToast({
        title: '地址必选',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    };

    if (that.data.address == '') {
      wx.showToast({
        title: '详细地址必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkAddress(that.data.address)) {
      wx.showToast({
        title: '详细地址格式',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    if (that.data.postCode == '') {
      wx.showToast({
        title: '邮编必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkPostcode(that.data.postCode)) {
      wx.showToast({
        title: '邮编长度6位',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    }

    var data = {};
    var _cache = Math.random(15);
    data.provinceId = that.data.provinceId;
    data.cityId = that.data.cityId;
    data.areaId = that.data.areaId;
    data.address = that.data.address;
    data.postCode = that.data.postCode;
    data.consignee = that.data.consigner;
    data.mobile = that.data.mobile;
    data.isDefault = that.data.isDefault;
    data._cache = _cache;

    wx.request({
      url: app.globalData.url + '/receive_address/',
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "cookieId=" + wx.getStorageSync("cookieId")
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '编辑成功',
            duration: 1000
          })
        };

        wx.navigateBack({
          delta: 1
        })

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