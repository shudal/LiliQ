let app = getApp()
const TYPE_LOVE = 1
const TYPE_COURSE = 2
const TYPE_LOST = 3
const TYPE_SHOP  = 4;
const TYPE_ALL = 0;
import {baseEncode} from "../../utils/util"
Page({
    data: {
        formData: {
            type: TYPE_ALL,
            year: 0
        },
        pickerindex: 0,
        picker: ['所有', '课程', '失物', '集市', '普通'],
        pickertype: [TYPE_ALL ,TYPE_COURSE, TYPE_LOST, TYPE_SHOP, TYPE_LOVE],
        pickeryearindex: 0,
        pickeryear: ['所有', '2019', '2018', '2017', '2016'],
        showTypeCourse: true
    },
    onLoad: function(e) {
        this.showTypeDetail();
    }, 
    getPicerIndexFromType(type) {
      switch(type) {
        case TYPE_ALL:
          return 0; break;
        case TYPE_COURSE:
          return 1; break;
        case TYPE_LOST:
          return 2; break;
        case TYPE_SHOP:
          return 3; break;
        case TYPE_LOVE:
          return 4; break;
      }
    },
    showTypeDetail() {
        let that = this;
        this.data.pickerindex = this.getPicerIndexFromType(this.data.formData.type)
        this.setData({
            pickerindex: that.data.pickerindex
        })
        console.log(that.data.pickerindex)
        if (this.data.formData.type != TYPE_COURSE) {
            this.setData({
                showTypeCourse: false
            })
        } else {
            this.setData({
                showTypeCourse: true
            })
        }
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
      if (y == '所有') {
          y = 0
      }
      this.setData({
        pickeryearindex: e.detail.value, 
        [`formData.year`]: y
      }) 
    },
    formInputChange: function(e) {
        console.log(e)
        const {field} = e.currentTarget.dataset;
        this.setData({
            [`formData.${field}`]: e.detail.value
        });
        console.log(this.data.formData);
    },
    encode: function (str){
        // 对字符串进行编码
        var encode = encodeURI(str);
        // 对编码的字符串转化base64
        var base64 = btoa(encode);
        return base64;
    },
    mySubmit: function(e) {
        console.log("submit")
        let formData = {}
        for (let key in this.data.formData) {
            formData[key] = this.data.formData[key]
        }
        if (formData.type == TYPE_ALL) {
            formData.type = "";
        }
        if (formData.year == 0) {
            formData.year = "";
        }
        console.log(formData)
        let url = ""
        // url="index/post/search?"
        for (let key in formData) {
            url = url + "&" + key + "=" + formData[key]
        } 
        //url = baseEncode(url)
        let pageUrl = "/pages/index/index?" + url
        qq.reLaunch({
            url: pageUrl
        })
    }
})