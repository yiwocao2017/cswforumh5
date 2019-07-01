import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Flex, Toast} from 'antd-mobile';
import ActivitySwipe from '../ActivitySwipe';
import NormalHeader from '../NormalHeader';
import {ActivityCtr} from '../../controller/ActivityCtr';
import {GeneralCtr} from '../../controller/GeneralCtr';
import './index.scss';

const Util = require('../../util/util');

export default class Activity extends Component {
    constructor(){
        super();
        this.state = {
            activity: null
        };
    }
    componentDidMount(){
        Util.showLoading();
        this.getActivity()
            .then(() => {
                this.getInitWXSDKConfig();
                Util.hideLoading();
            })
            .catch(() => {});
        this.readActivity();
    }
    // 获取活动详情
    getActivity(){
        let {code} = this.props.params;
        return ActivityCtr.getActivity(code, 1)
            .then((data) => {
                this.setState({activity: data});
            });
    }
    // 获取微信初始化的参数
    getInitWXSDKConfig(){
        GeneralCtr.getInitWXSDKConfig()
            .then((data) => {
                this.initWXSDK(data);
            }).catch(() => {});
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
                title = activity.title,
                desc = Util.clearTag(activity.description),
                imgUrl = Util.getActivityShareImg(activity.pic1);

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
    // 点击报名按钮
    applyOrder(activity, e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin(true);
            return;
        }
        if(this.result.pay){
            Util.goPath(`/actPay/${activity.orderCode}`);
            return;
        }
        Util.goPath(`/apply/${activity.code}`);
    }
    // 浏览活动
    readActivity(){
        let {code} = this.props.params;
        ActivityCtr.readActivity(code).then(() => {}).catch(() => {});
    }
    // 回退
    goBack(){
        if(window.history.length == 1){
            Util.goPath('/activity');
        }else{
            if(sessionStorage.getItem("isback")){
                sessionStorage.removeItem("isback");
                Util.goPath('/activity');
            }else{
                window.history.back();
            }
        }
    }
    // ios和android分享
    handleClick(){
        try {
            if(Util.is_mobile() && !Util.is_wechat()){
                let {activity} = this.state;
                if(Util.is_ios() && window.webkit){
                    let json = JSON.stringify({
                        event: "share",
                        params: {
                            url: location.href,
                            title: activity.title,
                            imgUrl: Util.getActivityShareImg(activity.pic1),
                            description: Util.clearTag(activity.description)
                        }
                    });
                    window.webkit.messageHandlers.webviewEvent.postMessage(json);
                }else if(window.android){
                    window.android.share(
                        location.href,
                        activity.title,
                        Util.clearTag(activity.description),
                        Util.getActivityShareImg(activity.pic1)
                    );
                }
            }
        }catch(e){
            Toast.info("error" + e);
        }
    }
    render() {
        let {activity} = this.state;
        this.result = Util.getStatusAndText(activity);
        let title = "活动详情";
        if(activity){
            title = activity && activity.title;
            Util.setTitle(title);
        }
        let showShare = false;
        if(Util.is_mobile() && !Util.is_wechat()){
            if(Util.is_ios() && window.webkit || window.android){
                showShare = true;
            }
        }
        return (
            <div>
                <NormalHeader
                    goBack={this.goBack.bind(this)}
                    fixed={true}
                    title={title}
                    unset={true}
                    rightIcon={showShare ? require('../../../images/share.png') : ""}
                    handleClick={this.handleClick.bind(this)}
                />
                <div style={{"height": "0.88rem"}}></div>
                {
                    activity
                        ?
                            <div class="activity-detail-container">
                                <div class="activity-detail-img-container">
                                    <ActivitySwipe data={activity.pic1}/>
                                </div>
                                <div class="activity-detail-info-container">
                                    <header>
                                        <h1>{activity.title}</h1>
                                        <div class="activity-detail-sub">{activity.scanNum}次浏览
                                            <span class="activity-detail-sub-num">参加人数<span>{activity.signNum}</span>人/{activity.limitNum}人</span>
                                        </div>
                                    </header>
                                    <div class="activity-detail-info-title-wrap">
                                        <div class="activity-detail-info-title-spin"></div>
                                        基本信息
                                    </div>
                                    <div class="activity-detail-item activity-calendar">
                                        <span class="activity-detail-item-title">活动时间</span>{Util.formatDate(activity.beginDatetime, "yyyy.MM.dd hh:mm:ss")}
                                    </div>
                                    <div class="activity-detail-item activity-time">
                                        <span class="activity-detail-item-title">预定截止</span>{Util.formatDate(activity.endDatetime, "yyyy.MM.dd hh:mm:ss")}
                                    </div>
                                    <div class="activity-detail-item activity-money">
                                        <span class="activity-detail-item-title">活动费用</span>
                                        {
                                            activity.fee ?
                                                Util.formatMoney(activity.fee) + "元"
                                                : "免费"
                                        }
                                    </div>
                                    <Flex align="start" className="activity-detail-item activity-addr">
                                        <span class="activity-detail-item-title">活动地点</span>
                                        <Flex.Item className="activity-flex-item">{activity.holdPlace}</Flex.Item>
                                    </Flex>
                                    <div class="activity-detail-info-title-wrap">
                                        <div class="activity-detail-info-title-spin"></div>
                                        活动介绍
                                    </div>
                                </div>
                                <div class="act-description" id="content" dangerouslySetInnerHTML={{__html: activity.description}}></div>
                                <div style={{"height": "1.34rem"}}></div>
                                <div class="fix-b">
                                    <Button type="primary" disabled={this.result.disabled} onClick={this.applyOrder.bind(this, activity)}>
                                        {this.result.text}
                                    </Button>
                                </div>
                            </div>
                        : null
                }
            </div>
        )
    }
}
