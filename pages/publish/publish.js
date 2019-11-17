let app = getApp();
Page({
    data: {
        formData: {
          nickname: ''
        },
        imgList: [],
        maxPicLength: 3,
        userInfo: null
    },
    onShow: function (e) {
      let that = this
      console.log(app.globalData.userInfo)
      if (that.data.userInfo == null && app.globalData.userInfo != null) {
        that.data.userInfo = app.globalData.userInfo
        that.data.formData.nickname = that.data.userInfo.nickName
        that.data.formData.userid = that.data.userInfo.userid
        that.setData({
          userInfo: that.data.userInfo,
          formData: that.data.formData
        })
      }  
    },
    onLoad: function (e) { 
      let that = this 
    },
    formInputChange: function(e) {
        console.log(e)
        const {field} = e.currentTarget.dataset;
        this.setData({
            [`formData.${field}`]: e.detail.value
        });
        console.log(this.data.formData);
    },
    ChooseImage() {
      let that = this
    wx.chooseImage({
      count: that.maxPicLength, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  myRealSubmit() {
              let that = this 
              console.log(that.data.formData)  
              wx.request({
                url: app.globalData.SERVER_URL + "index/post/add",
                method: "POST",
                header: { 'content-type':'application/x-www-form-urlencoded'
                },
                data: that.data.formData,
                success (res) {
                    if (res.data.code == 0) {
                        console.log(res);
                        wx.showModal({
                            title: '成功',
                            content: '发布成功',
                            showCancel: false
                        })
                    } else {
                        wx.showModal({
                            title: '失败 ',
                            content: '出现未知错误',
                            showCancel: false
                        })
                    }
                },
                complete (res) { 
                  console.log("ok")
                  wx.hideLoading()
                }
            })
  },
  checkLogin() {
    let that = this
    if (that.data.userInfo == null) {
      wx.showModal({
          title: '失败 ',
          content: '请前往 我的 页面授权获取您的基本信息',
          showCancel: false
      })
      return false
    }

    return true
  },
  checkInput() {
    let that = this;
    let formData = that.data.formData
    let flag = true
    let noti = ""
    if (formData.content == null || formData.content == "") {
      flag = false
      noti = "内容太少拉"
    }
    if (flag == false) {
      wx.showModal({
          title: '失败 ',
          content: noti,
          showCancel: false
      })
    } else {
      return true
    }
  },
  mySubmit() {
      wx.showLoading({
        title: '发布ing',
        mask: true
      })
      let that = this

      if (!that.checkLogin()) {
        wx.hideLoading()
        return
      }
      if (!that.checkInput()) {
        wx.hideLoading()
        return
      }

      let imgStr = ""

      for (let i=0; i<that.data.imgList.length; ++i) {
        let fPath = that.data.imgList[i]
        wx.getFileSystemManager().readFile({
          filePath: fPath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            imgStr = imgStr + 'data:image/png;base64,' + res.data
            if (i != that.data.imgList.length - 1) {
              imgStr = imgStr + "|"
            } 
            if (i == that.data.imgList.length - 1) {
              that.data.formData.img = imgStr
            that.myRealSubmit();
            }
          }
        }) 
      } 

      if (that.data.imgList.length == 0) {
        that.myRealSubmit()
      }
      
  },
  
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '保留',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
})