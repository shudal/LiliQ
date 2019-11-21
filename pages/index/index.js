let app = getApp(); 
Page({
    data: {
        posts: [ 
        ],
        isCard: true,
        page: 1,
        pageSize: 5,
        imgs: {},
        imgCount: 0,
        maxPage: -1,
        avas: {
            "-1": "https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
        },
        showedAll: false, 
        formData: null,
        comments: []
    },
    getImgFor(pid, imgId) {
        let that = this 
        wx.request({
        url: app.globalData.SERVER_URL + "index/post/img?imgid=" + imgId, 
        method: "GET",
        success(res) {
            console.log(res);
            if (res.data.code == 0) {    
                let i=0;
                let imgCount = that.data.imgCount + 1
                for (; i<that.data.posts.length; ++i) {
                    if (that.data.posts[i].id == pid) {
                        console.log("得到图片id=" + imgId)
                        that.data.posts[i].rimg.push(imgCount) 
                        break
                    }
                } 
                that.setData({
                    [`posts[${i}].rimg`]: that.data.posts[i].rimg,
                    imgCount: imgCount
                })
                let theImg = res.data.data.replace(/[\r\n]/g, "")
                that.setData({ 
                        [`imgs.${imgCount}`]: theImg,
                })
                /*
                try { 
                    that.setData({ 
                        [`imgs.${imgCount}`]: res.data.data,
                    })
                } catch (err) {
                    console.log("设置图片错误");
                    console.log(err)
                } 
                */
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
    getImg() {
        let that = this
        for (let i=0; i<that.data.posts.length; ++i) {
            if (that.data.posts[i].rimg.length == 0) { 
                console.log(that.data.posts[i].img)
                let aPostImgs = that.data.posts[i].img.split("|") 
                for (let k=0; k<aPostImgs.length; ++k) {
                    that.getImgFor(that.data.posts[i].id, aPostImgs[k])
                } 
            }
            let postUserId = that.data.posts[i].userid
            if (that.data.avas[postUserId] == undefined) {
                that.getAva(postUserId)
            }
        }
    },
    getPost() {
        let that = this
        wx.showLoading({
            title: '加载ing'
        })
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/all?size=" + that.data.pageSize + "&page=" + that.data.page, 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {
                    that.data.page += 1
                    let tposts = res.data.data.data
                    for (let i=0; i<tposts.length; ++i) {
                        tposts[i].rimg = []
                    }
                    that.data.posts = that.data.posts.concat(tposts)
                    that.data.maxPage = res.data.data.last_page
                    that.setData({
                        page: that.data.page,
                        posts: that.data.posts,
                        maxPage: that.data.maxPage
                    }) 
                    that.getImg()
                }
            },
            complete(res) {
                wx.hideLoading()
            }
        }); 
    },
    onLoad: function (e) {
        let that = this  
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        that.realGetPost()
    },
    realGetPost() { 
        let that = this
        console.log("maxPage=" + that.data.maxPage)
        console.log("apge=" + that.data.page)
        if (that.data.maxPage == -1 || that.data.page <= that.data.maxPage) {
            that.getPost()
        } else {
            that.setData({
                showedAll: true
            })
        }
    },
    onReachBottom: function (e) {
        this.realGetPost()
    },
    onShow: function (e) {
        let that = this
        that.getFirstPage(1)
    },
    initVar() {
        let that = this
        that.setData({
            page: 1,
            posts: [],
            imgs: {},
            imgCount: 0,
            showAll: false
        })
        
        that.getPost()
    },
    getFirstPage(thePage) {
        let that = this; 
        if (that.data.posts.length < 1) {
            return
        }
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/all?size=1&page=1", 
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) { 
                    let tposts = res.data.data.data  
                    let p = tposts[0]
                    if (p.id > that.data.posts[0].id) {
                        that.initVar()
                    } 
                }
            },
            complete(res) { 
            }
        }); 
    },
    inc: function (e) {
        let that = this
        let formData = {}
        formData.id = e.currentTarget.dataset.id
        formData.field = e.currentTarget.dataset.field
        formData.n = 1
        for (let i=0; i<that.data.posts.length; ++i) { 
            if (that.data.posts[i].id == formData.id) {
                that.data.posts[i].gvol += 1
                that.setData({
                    [`posts[${i}]`]: that.data.posts[i]
                })
                break
            }
        }
        wx.request({
            url: app.globalData.SERVER_URL + "index/post/inc",
            method: "POST",
            header: { 'content-type':'application/x-www-form-urlencoded'
            },
            data: formData,
            success (res) {
                console.log(res)
                if (res.data.code == 0) {
                     
                } else { 
                }
            },
            complete (res) {  
            }
        })
    },
    showDetail(e) {
        wx.navigateTo({
            url: './../detail/detail?postid=' + e.currentTarget.dataset.id
        })
    }  
})

 