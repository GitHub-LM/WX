// directory.js
const address = require('../../../js/area.js')
const pubFun = require('../../../js/public.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   * 当前    provinces:所有省份
   * citys选择省对应的所有市,
   * areas选择市对应的所有区
   * provinces：当前被选中的省
   * city当前被选中的市
   * areas当前被选中的区
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
    areaInfo:'',
    consigner: '',
    mobile: '',
    provinces: [],
    citys: [],
    areas: [],
    provinceId: '',
    cityId: '',
    areaId: '',
    address:"",
    postCode:'',
    isDefault: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    //console.log(this.data)
  },
  // 显示
  showMenuTap: function(e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function(e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function(isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function(e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
  },
  // 日志选择
  bindDateChange: function(e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function() {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  /*
  收货人
  */
  consigner: function(e) {
    this.setData({
      consigner: e.detail.value
    })
  },
  /*
  手机号
  */
  mobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  /*
  详细地址
  */
  address: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  /*
  邮编
  */
  postCode: function(e) {
    this.setData({
      postCode: e.detail.value
    })
  },
  /*
    切换默认状态
  */
  switchChange: function(e) {
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
  savaAddress: function() {
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

    if (that.data.postCode == ''){
      wx.showToast({
        title: '邮编必填',
        duration: 1000,
        image: '../../../img/error.png'
      })
      return false;
    } else if (!pubFun.checkPostcode(that.data.postCode)){
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
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '新增地址成功',
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name;
    var ids = that.data.provinces[value[0]].id + ',' + that.data.citys[value[1]].id + ',' + that.data.areas[value[2]].id;
    var provinceId = that.data.provinces[value[0]].id;
    var cityId = that.data.citys[value[1]].id;
    var areaId = that.data.areas[value[2]].id;
    that.setData({
      areaInfo: areaInfo,
      provinceId: provinceId,
      cityId: cityId,
      areaId: areaId
    });
    console.log(this.data.areaInfo, ids);
  },
  hideCitySelected: function(e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },

})