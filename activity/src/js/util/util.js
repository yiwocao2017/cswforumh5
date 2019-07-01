import { hashHistory } from 'react-router';
import React from 'react';
import {Toast} from 'antd-mobile';

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
const Util = {
    formatDate: (date, format = "yyyy-MM-dd hh:mm:ss") => {
        if (!date)
            return "--";
        return new Date(date).format(format);
    },
    formatMoney: function(s, t) {
        s = +s;
        if(typeof s !== "number")
            return "--";
        var num = +s / 1000;
        num = (num+"").replace(/^(\d+\.\d\d)\d*/i, "$1");
        return (+num).toFixed(t || 2);
    },
    // 后退
    historyBack: (e) => {
        if(window.history.length == 1){
            Util.goPath('/');
        }else{
            window.history.back();
        }
    },
    historyGo: (index) => {
        window.history.go(index);
    },
    // 跳转到指定url
    goPath: (path, replace = false) => {
        if(replace && hashHistory.replace){
            hashHistory.replace(path);
        }else{
            hashHistory.push(path);
        }
    },
    // 微信设置页面标题
    setTitle: (title) => {
        document.title = title;
        let iframe = document.createElement('iframe');
        iframe.src = '//m.baidu.com/favicon.ico';
        iframe.style.display = 'none';
        iframe.onload = () => {
            setTimeout(() => {
                iframe.remove();
            }, 9);
        };
        document.body.appendChild(iframe);
    },
    // 显示loading
    showLoading: (msg = "加载中...") => {
        Toast.info(<div><div class="global-loading-icon"></div>{msg}</div>, 0, null, true);
    },
    // 隐藏loading
    hideLoading: () => {
        Toast.hide();
    },
    // 判断是否登录
    isLogin: () => (
        !!sessionStorage.getItem("userId")
    ),
    // 跳转到登录页面
    goLogin: () => {
        let rUrl = location.href;
        sessionStorage["out"] = 1;
        location.href = CSW_URL + "?rUrl=" + encodeURIComponent(rUrl);
    },
    // 从支付跳转到登录页面
    goLoginBeforPay: () => {
        let rUrl = location.href;
        sessionStorage["out"] = 1;
        location.href = CSW_URL + "?rUrl=" + encodeURIComponent(rUrl) + "&pay=1";
    },
    // 从sessionStorage获取公司
    getCompanyCode: () => {
        return sessionStorage["companyCode"] || "";
    },
    // 保存公司信息到sessionStorage
    setCompanyCode: (code) => {
        code && (sessionStorage["companyCode"] = code);
    },
    // 保存userId和token到sessionStorage
    setUser: (data) => {
        sessionStorage["userId"] = data.userId;
        sessionStorage["token"] = data.token;
    },
    // 把用户的userId和token从sessionStorage中移除
    clearUser: () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token");
    },
    // 从sessionStorage获取userId
    getUserId: () => (
        sessionStorage["userId"]
    ),
    // 裁剪帖子列表的帖子图片
    formatTitleThumbanailImg: (imgUrl) => (Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!90x70r/interlace/1")),
    // 获取图片正确的地址
    formatImg: (imgUrl, suffix = "?imageMogr2/auto-orient/interlace/1") => {
        if(!imgUrl){
            return "";
        }
        imgUrl = imgUrl.split("||")[0];
        if(!/^http|^data:image/i.test(imgUrl)){
            // 部分手机上因为%这个符号，无法正确显示图片
            imgUrl = encodeURIComponent(imgUrl);
            imgUrl = PIC_PREFIX + imgUrl + suffix;
        }
        return imgUrl;
    },
    // 获取微信分享图片
    getShareImg: (img) => {
        if (img) {
            return Util.formatImg(img);
        }
        var sharImg = require('../../images/loading.png');
        if (/data:image/.test(sharImg) || /http(?:s)?/.test(sharImg)) {
            return sharImg;
        }
        return location.origin + sharImg;
    },
    // 从数组中根据key找到指定对象
    findItemInArr: (arr, item, key) => {
        for(let i = 0, len = arr.length; i < len; i++){
            let _item = arr[i];
            if(_item[key] == item[key]){
                return i;
            }
        }
        return -1;
    },
    // 是否是空字符串
    isEmptyString: (str) => {
        if(str && str.trim() !== "")
            return false;
        return true;
    },
    isUndefined: (str) => {
        if(!str || str === ""){
            return true;
        }
        return false;
    },
    /*
     * 冒泡排序，默认升序
     * @param list 排序数组
     * @param key 按数组的哪个key排序
     * @param isDesc 是否降序，默认升序,
     * @return {array}  排序好到数组
     */
    bubbleSort: (list, key, isDesc) => {
        for(var i = 0; i < list.length - 1; i++){
            for(var j = i + 1; j < list.length; j++){
                let value1 = list[i][key],
                    value2 = list[j][key];
                if(key == "orderNo"){
                    value1 = +value1;
                    value2 = +value2;
                }
                if(!isDesc){
                    if(value1 > value2){
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }else{
                    if(value1 < value2){
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }
            }
        }
        return list;
    },
    // 没有数据时的显示
    noData: (msg) => {
        return <div class="no-data">{msg}</div>
    },
    // 图片onload
    handleOnLoad: (e) => {
        let {width, height} = e.target;
        if(width < height){
            e.target.className = "wp100";
        }else{
            e.target.className = "hp100";
        }
    },
    // 获取活动按钮的disabled和text
    getStatusAndText: (activity) => {
        let result = {
            disabled: true,
            text: '立即参加'
        };
        // 如果未传入活动
        if(!activity){
            return result;
        }
        // 已报名（已支付）
        if(activity.isBook == "1"){
            result.text = "已报名";
            return result;
        }
        // 已结束
        if(activity.status == "2"){
            result.text = "已下架";
            return result;
        }
        let now = new Date((new Date().format("yyyy-MM-dd hh:mm:ss"))).getTime(),
            end = new Date(new Date(activity.endDatetime).format("yyyy-MM-dd HH:mm:ss")).getTime();
        // 活动结束日期已过
        if(now >= end){
            result.text = "已结束";
            return result;
        }

        let start = new Date(new Date(activity.beginDatetime).format("yyyy-MM-dd hh:mm:ss")).getTime();

        // 活动开始时间已过
        if(now >= start){
            result.text = "进行中";
            return result;
        }
        // 已满员
        if(+activity.signNum >= +activity.limitNum){
            result.text = "已满员";
            return result;
        }
        // 待支付
        if(activity.book == "1"){
            result.text = "立即付款";
            result.disabled = false;
            result.pay = true;
            return result;
        }
        // 可以报名
        result.disabled = false;
        return result;
    },
    // 判断是否 ios
    is_ios: () => {
        var browserName = navigator.userAgent.toLowerCase();
        return /(iphone|ipod|ipad)/i.test(browserName);
    },
    // 判断是否 微信浏览器
    is_wechat: () => {
        var browserName = navigator.userAgent.toLowerCase();
        return /(MicroMessenger)/i.test(browserName);
    },
    // 判断是否 mobile
    is_mobile: () => {
        var browserName = navigator.userAgent.toLowerCase();
        return /(blackberry|playbook|configuration\/cldc|hp |hp-|htc |htc_|htc-|iemobile|kindle|midp|mmp|motorola|mobile|nokia|opera mini|opera |Googlebot-Mobile|YahooSeeker\/M1A1-R2D2|android|iphone|ipod|ipad|mobi|palm|palmos|pocket|portalmmm|ppc;|smartphone|sonyericsson|sqh|spv|symbian|treo|up.browser|up.link|vodafone|windows ce|xda |xda_)/i.test(browserName);
    },
    clearTag: (content) => (
        content.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>/ig, "")
    )
};
module.exports = Util;
