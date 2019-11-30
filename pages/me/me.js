//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: '喵喵喵!',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalName: null,
    formData: {},
    saveToDeskImg: "data:image/png;base64,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",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    qq.showShareMenu({
  showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
})
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    app.login()
  }, 
  formInputChange: function(e) {
      console.log(e)
      const {field} = e.currentTarget.dataset;
      this.setData({
          [`formData.${field}`]: e.detail.value
      });
      console.log(this.data.formData);
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  mySubmit(e) {
    let that = this
    let formData = this.data.formData
    wx.showLoading({
      title: '提交ing'
    })
    let flag  = true
    let msg = "出现未知错误"
    if (formData.advice == null || formData.advice == "") { 
      flag = false
      msg = "您似乎没有输入~"  
    } else if (formData.advice.length >= 30) {
      flag = false
      msg = "精简一下文字趴~"
    }
    if (!flag) {
      wx.showToast({
        icon: "none",
        title: msg
      })
      wx.hideLoading()
      return
    }

    formData.userid = app.globalData.userInfo.userid
    wx.request({
      url: app.globalData.SERVER_URL + "index/admin/advice",
      method: "POST",
      header: { 'content-type':'application/x-www-form-urlencoded'
      },
      data: formData,
      success (res) {
          if (res.data.code == 0) {
              console.log(res);
              wx.showToast({
                icon: "success",
                title: "反馈好了~"
              })
              that.hideModal()
          } else {
              wx.showToast({
                  icon: "none",
                  title: '出现未知错误', 
              })
          }
      }
    })
  },
  addToDesk(e) {
    qq.saveAppToDesktop({
      success: function(e) {
        wx.showToast({
          icon: "success",
          title: "添加好了~"
        })
      },
      fail: function(e) {
        wx.showToast({
          icon: "none",
          title: "没添加好~"
        })
      }
    })
  }
})
