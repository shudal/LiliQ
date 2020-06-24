let app = getApp()

const TYPE_LOVE = 1
const TYPE_COURSE = 2
const TYPE_LOST = 3
const TYPE_SHOP  = 4;
Page({
    data: {
        formData: {},
        comments: [],
        postid: null,
        posts: [],
        isCard: true,
        imgCount: 0,
        imgs: {},
        cimgids: {},
        avas: {},
        InputBottom: 0,   
    },
    addFriend(e) {
        let that = this
        const button = qq.createAddFriendButton({
            type: 'text',
            text: '添加好友',
            style: {
                left: 10,
                top: 76,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            },
            openid: that.data.posts[0].userid
        })
        button.show()
    },
    showBigImg(e) {   
        let that = this
        let imgids = this.data.posts[0].img.split("|") 
        let urls = []
        for (let i=0; i<imgids.length; ++i) {
            urls.push(app.globalData.SERVER_URL + "index/post/imgRaw?imgid=" + imgids[i])
        }
        wx.previewImage({
            urls: urls,
            current: app.globalData.SERVER_URL + "index/post/imgRaw?imgid=" + e.currentTarget.dataset.imgid
        })

    },
    onLoad: function (e) { 
      qq.showShareMenu({
  showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
})
        console.log("onLoad:")
        console.log(e)
        this.setData({
            postid: e.postid
        })
        this.k(this.data.postid)
    },
    onShow: function (e) { 

    },
    k(postid) {
        this.getPost(postid)
        this.getCommentFor(postid)
        this.setData({ 
            [`formData.postid`]: postid
        })
        if (this.data.formData.userid == null && app.globalData.userInfo.userid != null) {
            this.setData({
                [`formData.userid`]: app.globalData.userInfo.userid
            })
        } 
    },
    getCommentFor: function (id) {
        let that = this
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/comment?postid=" + id, 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {  
                    for (let i=0; i<res.data.data.length; ++i) {
                        that.getAva(res.data.data[i].userid)
                        res.data.data[i].index = i + 1
                    } 
                    that.setData({
                        comments: res.data.data
                    }) 
                }
            },
            complete(res) { 
            }
        }) 
    },
    getPost: function (postid) {
        let that = this 
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/post?postid=" + postid, 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {    
                    that.data.posts[0] = res.data.data
                    that.data.posts[0].rimg = []
                    that.data.posts[0].imgids = res.data.data.img.split("|")
                    if (that.data.posts[0].type == TYPE_COURSE) {
                            if (that.data.posts[0].teacher != '') {
                                that.data.posts[0].content = "【" + that.data.posts[0].teacher + "】" + that.data.posts[0].content
                            }
                            if (that.data.posts[0].coursename != '') {
                                that.data.posts[0].content = "【" + that.data.posts[0].coursename + "】" + that.data.posts[0].content
                            }
                            if (that.data.posts[0].year != '') {
                                that.data.posts[0].content = "【" + that.data.posts[0].year + "】" + that.data.posts[0].content
                            }
                    }
                    that.setData({
                        [`posts[0]`]: that.data.posts[0]
                    })
                    if (that.data.avas[res.data.data.userid] == undefined) {
                        that.getAva(res.data.data.userid)
                    }
                    let aPostImgs = res.data.data.img.split("|") 
                    for (let k=0; k<aPostImgs.length; ++k) {
                        that.getImgFor(postid, aPostImgs[k])
                    } 
                }
            }
        })
    },
    getAva(userid) {
        let that = this 
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/img?userid=" + userid, 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {    
                    that.setData({
                        [`avas.${userid}`]: res.data.data
                    })
                }
            }
        })  
    },
    getImgFor(pid, imgId) {
        let that = this 
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/img?imgid=" + imgId, 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {    
                    let imgCount = that.data.imgCount
                    imgCount += 1  
                    that.data.posts[0].rimg.push(imgCount)
                    that.setData({
                        posts: that.data.posts,
                        imgCount: imgCount
                    })
                    let theImg = res.data.data.replace(/[\r\n]/g, "")
                    that.setData({ 
                            [`imgs.${imgCount}`]: theImg,
                            [`cimgids.${imgCount}`]: imgId
                    }) 
                }
            }
        })  
    },
    mySubmit(e) {  
        let that = this 
        if (!that.checkInput()) {
            return
        }
        console.log(that.data.formData)  
        wx.showLoading({
            title: "发送ing",
            mask: true
        })
        wx.request({
            url: app.globalData.SERVER_URL + "index/comment/add",
            method: "POST",
            header: { 'content-type':'application/x-www-form-urlencoded'
            },
            data: that.data.formData,
            success (res) {
                if (res.data.code == 0) { 
                    that.getCommentFor(that.data.postid)
                    that.data.posts[0].cvol += 1
                    that.setData({
                        posts: that.data.posts
                    })
                } else {
                    wx.showToast({
                        icon: "none",
                        title: "发布失败 出现令人困惑的错误"
                    })
                }
            },
            complete (res) {  
                wx.hideLoading()
            }
        })
    },
    checkInput() {
        let that = this;
        let formData = that.data.formData
        console.log(formData)
        let flag = 1
        let noti = "出现未知错误"
        if (formData.userid == null) {
            flag = 0; noti = "请前往 我的 页面授权获取您的基本信息" 
        }
        if (formData.content == null || formData.content == "") {
            flag = 0; noti = "内容太少拉"
        }
        if (flag == 0) {
            wx.showModal({
                title: '失败 ',
                content: noti,
                showCancel: false
            })
            return false
        }
        return true
    }, 
    formInputChange: function(e) {
        console.log(e)
        const {field} = e.currentTarget.dataset;
        this.setData({
            [`formData.${field}`]: e.detail.value
        });
        console.log(this.data.formData);
    }, 
    incComment: function (e) {
        let that = this
        let formData = {}
        formData.id = e.currentTarget.dataset.id
        formData.field = e.currentTarget.dataset.field
        formData.n = 1
        for (let i=0; i<that.data.comments.length; ++i) {
            if (that.data.comments[i].id == formData.id) {
                that.data.comments[i].gvol += 1;
                that.setData({
                    [`comments[${i}]`]: that.data.comments[i]
                })
                break
            }
        } 
        wx.request({
            url: app.globalData.SERVER_URL + "index/comment/inc",
            method: "POST",
            header: { 'content-type':'application/x-www-form-urlencoded'
            },
            data: formData,
            success (res) {
                console.log(res)
                if (res.data.code == 0) { 
                    
                } 
            },
            complete (res) {  
            }
        })
    },
    inc: function (e) {
        let that = this
        let formData = {}
        formData.id = e.currentTarget.dataset.id
        formData.field = e.currentTarget.dataset.field
        formData.n = 1
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/inc",
            method: "POST",
            header: { 'content-type':'application/x-www-form-urlencoded'
            },
            data: formData,
            success (res) {
                console.log(res)
                if (res.data.code == 0) { 
                    that.data.posts[0].gvol += 1
                    that.setData({
                        posts: that.data.posts 
                    })     
                } 
            },
            complete (res) {  
            }
        })
    },
    InputFocus(e) {
        this.setData({
        InputBottom: e.detail.height
        })
    },
    InputBlur(e) {
        this.setData({
        InputBottom: 0
        })
    }
})