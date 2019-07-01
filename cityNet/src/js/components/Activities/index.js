import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import ActivityItem from './ActivityItem';
import {ActivityCtr} from '../../controller/ActivityCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import NormalHeader from '../NormalHeader';
import './index.scss';

const Util = require('../../util/util');

export default class Activities extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),
            activities: []
        };
        this.isWxConfiging = false;
        this.wxData = null;
    }
    componentDidUpdate(){
        if(document.title != "同城活动" && /#\/activity\?/.test(location.href)) {
            Util.setTitle("同城活动");
        }
        if(/#\/activity\?/.test(location.href)){
            // 当前页面,并且微信sdk未初始化
            if(!this.isWxConfiging && !this.wxData) {
                this.getInitWXSDKConfig();
            }
        }else{  // 进入活动页面后，置空微信的参数
            this.isWxConfiging = false;
            this.wxData = null;
        }
    }
    componentDidMount() {
        Util.showLoading("加载中...");
        this.getPageActivities(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
        if(/#\/activity\?/.test(location.href)){
            if(!this.isWxConfiging && !this.wxData){
                this.getInitWXSDKConfig();
            }
            if(sessionStorage.getItem("isback") && Util.isLogin()){
                sessionStorage.removeItem("isback");
            }
        }

    }
    // 分页查询活动列表
    getPageActivities(refresh) {
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return ActivityCtr.getPageActivities({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {activities} = this.state;
            activities = refresh && [] || activities;
            activities = [].concat.call(activities, data.list);
            hasMore && start++;
            this.setState({hasMore, start, activities});
        });

    }
    // 获取微信初始化的参数
    getInitWXSDKConfig(){
        this.isWxConfiging = true;
        GeneralCtr.getInitWXSDKConfig()
            .then((data) => {
                this.isWxConfiging = false;
                this.wxData = data;
                this.initWXSDK(data);
            }).catch(() => {
                this.isWxConfiging = false;
                this.wxData = null;
            });
    }
    // 初始化微信参数
    initWXSDK(data){
        wx.config({
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
                "checkJsApi",
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareQZone"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        let me = this;
        wx.ready(() => {
            let {activity} = this.state;
            let link = location.href,
                title = "同城活动",
                desc = Util.clearTag(Util.getCompany().description),
                imgUrl = Util.getActivityShareImg();

            // 分享给某人
            wx.onMenuShareAppMessage({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接
                imgUrl // 分享图标
            });
            // 朋友圈分享
            wx.onMenuShareTimeline({
                title, // 分享标题
                link, // 分享链接
                imgUrl // 分享图标
            });
            // qq分享
            wx.onMenuShareQQ({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接
                imgUrl // 分享图标
            });
            // qq空间分享
            wx.onMenuShareQZone({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接
                imgUrl // 分享图标
            });
        });
        wx.error(() => {
            Toast.fail("微信sdk初始化失败");
        });
    }
    // 加载更多活动
    handleLoadMore(resolve) {
        this.getPageActivities().then(resolve).catch(resolve);
    }
    // 刷新数据
    handleRefresh(resolve) {
        this.getPageActivities(true).then(resolve).catch(resolve);
    }
    // 返回事件
    goBack(){
        try {
            if(Util.is_mobile() && !Util.is_wechat()){
                if(Util.is_ios() && window.webkit){
                    let json = JSON.stringify({
                        event: "return"
                    });
                    window.webkit.messageHandlers.webviewEvent.postMessage(json);
                }else if(window.android){
                    window.android.back();
                }else{
                    Util.goPath('/home');
                }
            }else{
                Util.goPath('/home');
            }
        }catch(e){
            Toast.info("error" + e);
        }
    }
    render() {
        let {initializing, hasMore, activities} = this.state;
        return (
            <div>
                <div class="box" style={{
                    display: this.props.children ? "none": ""
                }}>
                    <NormalHeader goBack={this.goBack.bind(this)} title="同城活动"/>
                    <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true}>
                        {activities.length
                            ? activities.map((item, index) => (<ActivityItem key={item.code} activity={item}/>))
                            : Util.noData("暂无活动")
                        }
                    </Tloader>
                </div>
                {this.props.children}
            </div>
        )
    }
}
