import {hashHistory} from 'react-router';
import React from 'react';
import {Toast} from 'antd-mobile';
import {globalInfo} from '../containers/App';

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
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
const Util = {
    // loginContainer: document.getElementById('loginContainer'),
    formatDate: (date, format = "MM月dd日 hh:mm") => {
        if (!date)
            return "--";
        // if (typeof date == "string")
        //     date = date.replace(/(12:\d\d:\d\d\s)AM$/, "$1PM");
        return new Date(date).format(format);
    },
    formatMoney: function(s, t) {
        s = +s;
        if (typeof s !== "number")
            return "--";
        var num = +s / 1000;
        num = (num + "").replace(/^(\d+\.\d\d)\d*/i, "$1");
        return (+num).toFixed(t || 2);
    },
    // 后退
    historyBack: (e) => {
        if (window.history.length == 1) {
            Util.goPath('/home');
        } else {
            window.history.back();
        }
    },
    historyGo: (index) => {
        window.history.go(index);
    },
    // 跳转到指定url
    goPath: (path, replace = false) => {
        hashHistory.push(path);
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
    // 从localStorage获取公司
    getCompany: () => {
        let company = localStorage["company"];
        return company ? JSON.parse(company) : {};
    },
    // 保存公司信息到localStorage
    setCompany: (company) => {
        company && (localStorage["company"] = JSON.stringify(company));
    },
    // 从localStorage获取公司code
    getCompanyCode: () => {
        return Util.getCompany().code || "";
    },
    // 保存当前定位到的公司code
    saveDwCompanyCode: (code) => {
        code && (localStorage["lastCompCode"] = code);
    },
    getDwCompanyCode: () => {
        return localStorage["lastCompCode"];
    },
    // 从localStorage里获取地址
    getAddress: () => {
        let address = localStorage["address"];
        return address ? JSON.parse(address) : null;
    },
    // 保存地址信息到localStorage
    setAddress: (address) => {
        if (address) {
            let _addr = {
                province: address.province,
                city: address.city,
                area: address.area
            };
            localStorage["address"] = JSON.stringify(_addr);
        }
    },
    // 保存userId和token到localStorage
    setUser: (data) => {
        localStorage["userId"] = data.userId;
        localStorage["token"] = data.token;
    },
    // 把用户的userId和token从localStorage中移除
    clearUser: () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        globalInfo.user = {
            userId: "",
            nickname: "",
            userExt: {
                photo: ""
            }
        };
        ChatGlobalInfo.conn.close();
    },
    // 从localStorage获取userId
    getUserId: () => (
        localStorage["userId"]
    ),
    getToken: () => (
        localStorage["token"]
    ),
    // 判断是否登录
    isLogin: () => (!!Util.getUserId()),
    // 跳转到登录页面
    goLogin: (isReturn) => {
        sessionStorage.removeItem("return");
        sessionStorage.removeItem("isback");
        if(isReturn){
            let _hash = location.hash.substr(1).replace(/\?.*/i, "");
            sessionStorage.setItem("return", _hash);
            sessionStorage.setItem("isback", 1);
        }
        Util.goPath('/user/login');
    },
    // 登录后跳转到原来到页面
    goBackAfterLogin: () => {
        let returnUrl = sessionStorage.getItem("return");
        if (returnUrl) {
            sessionStorage.removeItem("return");
            Util.goPath(returnUrl);
        } else {
            //登录后跳转到首页
            Util.goPath('/home');
        }
    },
    setOutLoginUrl: (rUrl, isPay) => {
        if (rUrl) {
            sessionStorage["out-login-return"] = rUrl;
            if (isPay) {
                sessionStorage["out-login-pay"] = "1";
            }
        }
    },
    // 外部登录是否是支付的时候跳转的
    isOutPayLogin: () => (!!sessionStorage["out-login-pay"]),
    // 获取外部登录到回调域名
    getOutLoginUrl: () => (
        sessionStorage["out-login-return"]
    ),
    // 外部登录后跳转到原来到页面
    goBackAfterOutLogin: () => {
        let returnUrl = sessionStorage["out-login-return"];
        let rUrl = ACTIVITY_URL;
        if (returnUrl) {
            sessionStorage.removeItem("out-login-return");
            sessionStorage.removeItem("out-login-pay");
            rUrl = decodeURIComponent(returnUrl);
        }
        if(location.replace){
            window.top.location.replace(rUrl);
        }else{
            window.top.location.href = rUrl;
        }
    },
    // 计算密码强度
    calculateSecurityLevel: (password) => {
        var strength_L = 0;
        var strength_M = 0;
        var strength_H = 0;

        for (var i = 0; i < password.length; i++) {
            var code = password.charCodeAt(i);
            // 数字
            if (code >= 48 && code <= 57) {
                strength_L++;
                // 小写字母 大写字母
            } else if ((code >= 65 && code <= 90) ||
                (code >= 97 && code <= 122)) {
                strength_M++;
                // 特殊符号
            } else if ((code >= 32 && code <= 47) ||
                (code >= 58 && code <= 64) ||
                (code >= 94 && code <= 96) ||
                (code >= 123 && code <= 126)) {
                strength_H++;
            }
        }
        // 弱
        if ((strength_L == 0 && strength_M == 0) ||
            (strength_L == 0 && strength_H == 0) ||
            (strength_M == 0 && strength_H == 0)) {
            return "1";
        }
        // 强
        if (0 != strength_L && 0 != strength_M && 0 != strength_H) {
            return "3";
        }
        // 中
        return "2";
    },
    // 裁剪帖子列表的帖子图片
    formatTitleThumbanailImg: (imgUrl) => (Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!150x130r/interlace/1")),
    // 裁剪帖子详情的帖子图片
    formatThumbanailImg: (imgUrl) => (Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!140x140r")),
    // 获取图片正确的地址
    formatImg: (imgUrl, suffix = "?imageMogr2/auto-orient/interlace/1") => {
        if (!imgUrl) {
            return "";
        }
        imgUrl = imgUrl.split("||")[0];
        if (!/^http|^data:image/i.test(imgUrl)) {
            // 部分手机上因为%这个符号，无法正确显示图片
            imgUrl = encodeURIComponent(imgUrl);
            imgUrl = PIC_PREFIX + imgUrl + suffix;
        }
        return imgUrl;
    },
    // 裁剪商品列表的图片
    formatMallListImg: imgUrl => Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!180x180r/interlace/1"),
    // 裁剪列表中到头像
    formatListThumbanailAvatar: (imgUrl) => {
        imgUrl = imgUrl || require('../../images/default-avatar.png');
        return Util.formatImg(imgUrl, "?imageMogr2/auto-orient/thumbnail/!60x60r/interlace/1");
    },
    formatUserCenter: (imgUrl) => (Util.formatImg(imgUrl || require('../../images/default-avatar.png'), "?imageMogr2/auto-orient/thumbnail/!110x110r/interlace/1")),
    // 帖子分享图片
    getShareImg: (post) => {
        if (post.picArr && post.picArr[0]) {
            return Util.formatImg(post.picArr[0]);
        }
        var sharImg = require('../../images/loading.png');
        if (/data:image/.test(sharImg) || /http(?:s)?/.test(sharImg)) {
            return sharImg;
        }
        return location.origin + sharImg;
    },
    // 活动分享图片
    getActivityShareImg: (img) => {
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
        for (let i = 0, len = arr.length; i < len; i++) {
            let _item = arr[i];
            if (_item[key] == item[key]) {
                return i;
            }
        }
        return -1;
    },
    // 是否是空字符串
    isEmptyString: (str) => {
        if (str && str.trim() !== "")
            return false;
        return true;
    },
    isUndefined: (str) => {
        if (!str || str === "") {
            return true;
        }
        return false;
    },
    /*
     * 获取并保存textarea光标的位置
     * @param textBox    点击的表情
     */
    savePos: (textBox) => {
        let start, end;
        //如果是Firefox(1.5)的话，方法很简单
        if (typeof(textBox.selectionStart) == "number") {
            start = textBox.selectionStart;
            end = textBox.selectionEnd;
            end = textBox. //下面是IE(6.0)的方法，麻烦得很，还要计算上'/n'
            selectionEnd;
        } else if (document.selection) {
            var range = document.selection.createRange();
            if (range.parentElement().id == textBox.id) {
                // create a selection of the whole textarea
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
                //range_all.compareEndPoints() 比较两个端点，如果range_all比range更往左(further to the left)，则                //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
                // calculate selection start point by moving beginning of range_all to beginning of range
                for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                    range_all.moveStart('character', 1);

                // get number of line breaks from textarea start to selection start and add them to start
                // 计算一下/n
                for (var i = 0; i <= start; i++) {
                    if (textBox.value.charAt(i) == '/n')
                        start++;
                }
                // create a selection of the whole textarea
                var range_all = document.body.createTextRange();
                range_all.moveToElementText(textBox);
                // calculate selection end point by moving beginning of range_all to end of range
                for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++)
                    range_all.moveStart('character', 1);

                // get number of line breaks from textarea start to selection end and add them to end
                for (var i = 0; i <= end; i++) {
                    if (textBox.value.charAt(i) == '/n')
                        end++;
                }
            }
        }
        return {
            start: start,
            end: end
        }
    },
    // 解析子系统和banner的url
    parseSubSystemUrl: (url) => {
        if (/^page:/.test(url)) {
            if (/^page:mall/.test(url)) { //商城
                return {
                    outUrl: 0,
                    url: "/mall/list"
                };
            } else if (/^page:signin/.test(url)) { //签到
                return {
                    outUrl: 0,
                    signin: 1,
                    url: "signin"
                };
            } else if (/page:board,code:(.+)/.exec(url)) { //板块
                url = RegExp.$1;
                return {
                    outUrl: 0,
                    url: "/forum?code=" + url
                };
            } else if (/page:activity/.test(url)) {
                return {
                    outUrl: 0,
                    activity: 1
                };
            }
            return {
                outUrl: 0,
                url: url
            };
        }
        return {
            outUrl: 1,
            url: url
        };
    },
    /*
     * 冒泡排序，默认升序
     * @param list 排序数组
     * @param key 按数组的哪个key排序
     * @param isDesc 是否降序，默认升序,
     * @return {array}  排序好到数组
     */
    bubbleSort: (list, key, isDesc) => {
        for (var i = 0; i < list.length - 1; i++) {
            for (var j = i + 1; j < list.length; j++) {
                let value1 = list[i][key],
                    value2 = list[j][key];
                if (key == "orderNo") {
                    value1 = +value1;
                    value2 = +value2;
                }
                if (!isDesc) {
                    if (value1 > value2) {
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                } else {
                    if (value1 < value2) {
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }
            }
        }
        return list;
    },
    // 获取聊天数据
    getChatRoomData: () => {
        return JSON.parse(localStorage["chatRoomData"] || "{}");
    },
    // 保存聊天数据
    saveChatRoomData: (chatRoomData) => {
        localStorage["chatRoomData"] = JSON.stringify(chatRoomData);
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
    // 获取字符串的字节数
    _getBytesLength: (str) => {
        let totalLength = 0;
        let charCode;
        for (let i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                totalLength++;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            } else {
                totalLength += 4;
            }
        }
        return totalLength;
    },
    // 计算缓存大小 chatRoomData
    calculateBuffer: () => {
        let {
            chatRoomData
        } = localStorage;
        chatRoomData = JSON.stringify(chatRoomData || {});
        let bytes = Util._getBytesLength(chatRoomData),
            result;
        let _KB = 1024,
            _M = 1024 * 1024,
            _G = 1024 * 1024 * 1024;
        if (bytes < _M) {
            result = (bytes / _KB).toFixed(2) + "KB";
        } else if (bytes < _G) {
            result = (bytes / _M).toFixed(2) + "M";
        } else {
            result = (bytes / _G).toFixed(2) + "G";
        }
        return result;
    },
    // 清空缓存
    clearBuffer: () => {
        Util.clearUser();
        localStorage.removeItem("address");
        localStorage.removeItem("chatRoomData");
        Util.goPath('/home');
    },
    getLocation: (success, error) => {
        let map, geolocation;
        //调用浏览器定位服务
        map = new AMap.Map('', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 5e3, //超过5秒后停止定位，默认：无穷大
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', (data) => {
                success && success(data);
            });
            AMap.event.addListener(geolocation, 'error', (msg) => {
                error && error(msg);
            }); //定位出错信息
        });
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
        let now = new Date().getTime(),
            end = new Date(activity.endDatetime).getTime();
        // 活动结束日期已过
        if(now >= end){
            result.text = "已结束";
            return result;
        }
        let start = new Date(activity.beginDatetime).getTime();

        // 活动开始时间已过
        // if(now >= start){
        //     result.text = "进行中";
        //     return result;
        // }
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
        content.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>|&nbsp;/ig, "")
    )
};
module.exports = Util;
