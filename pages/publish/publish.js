let app = getApp();

const TYPE_LOVE = 1
const TYPE_COURSE = 2
const TYPE_LOST = 3
const TYPE_SHOP  = 4;
Page({
    data: {
        formData: {
          nickname: '',
          alladd: 0,
          type: 1,
          year: 2019
        },
        imgList: [],
        maxPicLength: 3,
        userInfo: null,
        showType: false,
        picker: ['课程', '失物', '集市', '普通'],
        pickeryear: ['2019', '2018', '2017', '2016'],
        pickertype: [TYPE_COURSE, TYPE_LOST, TYPE_SHOP, TYPE_LOVE],
        switchloveChecked: true
    },
    getPicerIndexFromType(type) {
      switch(type) {
        case TYPE_COURSE:
          return 0; break;
        case TYPE_LOST:
          return 1; break;
        case TYPE_SHOP:
          return 2; break;
        case TYPE_LOVE:
          return 3; break;
      }
    },
    onShow: function (e) {
      qq.showShareMenu({
  showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
})
      let that = this
      that.initData() 
    },
    
    PickerChange(e) {
      console.log(e.detail.value);
      let type = this.data.pickertype[e.detail.value]
      this.setData({
        pickerindex: e.detail.value, 
        [`formData.type`]: type
      }) 
      this.showTypeDetail();
    },
    PickerYearChange(e) {
      console.log(e.detail.value);
      let y = this.data.pickeryear[e.detail.value];
      this.setData({
        pickeryearindex: e.detail.value, 
        [`formData.year`]: y
      }) 
    },
    showTypeDetail() { 
      if (this.data.formData.type == TYPE_COURSE) {
        this.setData({
          showTypeCourse: true
        })
      } else {
        this.setData({
          showTypeCourse: false
        })
      }

      if (this.data.formData.type == TYPE_LOVE) {
        this.setData({
          showType: false,
          switchloveChecked: true
        })
      }
      
      let pickerindex = this.getPicerIndexFromType(this.data.formData.type) 
      this.setData({
        pickerindex: pickerindex
      })
    },
    switchLove(e) {
      console.log(e.detail.value)
      if (!e.detail.value) {
        this.setData({
          showType: true,
          [`formData.type`]: TYPE_COURSE
        }) 
        this.showTypeDetail();
      } else { 
        this.setData({
          [`formData.type`]: TYPE_LOVE
        })
        this.showTypeDetail();
      }
    },
    switchange(e) {
      console.log(e) 
      if (e.detail.value) {
        let flag = false
        qq.getSetting({
          success(res) {
            console.log("打开setting成功")
            if (!res.authSetting['setting.addFriend']) {
              qq.authorize({
                scope: 'setting.addFriend',
                success() { 
                  flag = true
                },
                fail(e) {
                  console.log("用户不受权")
                  console.log(e)
                }
              })
            } else {
              flag = true
            }
          },
          fail(e) {
            console.log(e)
            console.log("fail")
          },
          complete(e) {
            if (flag) { 
              that.data.formData.alladd = 1
            } else { 
            }
          }
        })
      } else {
        this.data.formData.alladd = 0
      }
      this.setData({
        [`formData.alladd`]: this.data.formData.alladd
      })
      console.log(this.data.formData)
    },
    initData() {
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

    if (formData.type == TYPE_COURSE) {
      if (formData.coursename == null || formData.coursename == "") { 
        flag = false
        noti = "课程名称更详细一点趴~"
      } else if (formData.teacher == null || formData.teacher == "") { 
        flag = false
        noti = "老师名字更详细一点趴"
      } else if (formData.coursename.length >= 30) {
        flag = false
        noti = "课程名称太详细啦"
      } else if (formData.teacher.length >= 15) {
        flag = false
        noti = "老师名字太详细啦"
      }
    }

    if (formData.userid != null) {

    } else if (formData.userid == undefined && app.globalData.userInfo.userid != null) {
      formData.userid = app.globalData.userInfo.userid
      console.log("重新设置userid")
      that.setData({
        formData: that.data.formData
      })
    } else {
      flag = false
      noti = "请一会儿后再提交"
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