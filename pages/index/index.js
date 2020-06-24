let app = getApp(); 

const TYPE_LOVE = 1
const TYPE_COURSE = 2
const TYPE_LOST = 3
const TYPE_SHOP  = 4;

import {baseDecode} from "../../utils/util"
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
        comments: [],
        getPostBaseUrl: "index/post/search?",
        addiRequestParam: {}
    },
    onLoad: function (e) {
        let that = this  

        console.log(e)
        if (e.type != null) {
            console.log(e.url)
            this.setData({
                addiRequestParam: e
            })
        }
        qq.showShareMenu({
            showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
        })
        that.realGetPost()
    },
    getImgFor(pid, imgId, postindex) {
        let that = this 
        wx.request({
        url: app.globalData.SERVER_URL + "index/post/img?imgid=" + imgId, 
        method: "GET",
        success(res) {
            console.log(res);
            if (res.data.code == 0) {    
                let i=postindex;
                let imgCount = that.data.imgCount + 1
                that.data.posts[postindex].rimg.push(imgCount); 
                that.setData({
                    [`posts[${i}].rimg`]: that.data.posts[i].rimg,
                    imgCount: imgCount
                })
                let theImg = res.data.data.replace(/[\r\n]/g, "")
                that.setData({ 
                        [`imgs.${imgCount}`]: theImg,
                }) 
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
                    that.getImgFor(that.data.posts[i].id, aPostImgs[k], i)
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
        let url = app.globalData.SERVER_URL + that.data.getPostBaseUrl + "&size=" + that.data.pageSize + "&page=" + that.data.page
        for (let key in that.data.addiRequestParam) {
            url = url + "&" + key + "=" + that.data.addiRequestParam[key]
        }
        wx.request({
            url:  url,
            method: "GET",
            success(res) {
                console.log(res);
                if (res.data.code == 0) {
                    that.data.page += 1
                    let tposts = res.data.data.data
                    for (let i=0; i<tposts.length; ++i) {
                        tposts[i].rimg = []
                        if (tposts[i].type == TYPE_COURSE) {
                            if (tposts[i].teacher != '') {
                                tposts[i].content = "【" + tposts[i].teacher + "】" + tposts[i].content
                            }
                            if (tposts[i].coursename != '') {
                                tposts[i].content = "【" + tposts[i].coursename + "】" + tposts[i].content
                            }
                            if (tposts[i].year != '') {
                                tposts[i].content = "【" + tposts[i].year + "】" + tposts[i].content
                            }
                        }
                    }
                    
                    that.data.posts = that.data.posts.concat(tposts)
                    that.data.maxPage = res.data.data.last_page
                    if (that.data.maxPage <= 1) {
                        that.setData({
                            showedAll: true
                        })
                    }
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
        
        let url = app.globalData.SERVER_URL + that.data.getPostBaseUrl + "&size=1&page=1"
        for (let key in that.data.addiRequestParam) {
            url = url + "&" + key + "=" + that.data.addiRequestParam[key]
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
        let index = parseInt(e.currentTarget.dataset.index);
        console.log(index)       
        that.data.posts[index].gvol += 1;
        that.setData({
            [`posts[${index}]`]: that.data.posts[index]
        })
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

 