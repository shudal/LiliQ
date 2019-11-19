//app.js
App({
  onLaunch: function() {
    let that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("RES:" + res.code)
        this.globalData.code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              this.login()
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                console.log(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    SERVER_URL: "https://qqapp.heing.fun/",
    code: ''
  }, 
  login() {
    let formData = {} 
    let app = this
    if (app.globalData.userInfo == null) {
      return
    }
    formData['gender'] = app.globalData.userInfo.gender
    formData['nickname'] = app.globalData.userInfo.nickName
    formData['avaurl'] = app.globalData.userInfo.avatarUrl
    formData['code'] = app.globalData.code
    console.log(formData)
    wx.request({
      url: app.globalData.SERVER_URL + "index/user/login", 
      method: "POST", 
      header: { 'content-type':'application/x-www-form-urlencoded'
      },
      data: formData,
      success(res) {
          console.log(res);
          if (res.data.code == 0) {  
            app.globalData.userInfo.userid = res.data.data.openid
            console.log("get openid from login():" + app.globalData.userInfo.userid)
          }
      }
    })
  },
})