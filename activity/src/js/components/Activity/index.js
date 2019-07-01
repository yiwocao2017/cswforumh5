import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Flex, Toast} from 'antd-mobile';
import Swipe from '../Swipe';
import NormalHeader from '../NormalHeader';
import {ActivityCtr} from '../../controller/ActivityCtr';
import './index.scss';

const Util = require('../../util/util.js');

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
            .then(Util.hideLoading)
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
    // 点击报名按钮
    applyOrder(activity, e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        if(this.result.pay){
            Util.goPath(`/pay/${activity.orderCode}`);
            return;
        }
        Util.goPath(`/apply/${activity.code}`);
    }
    // 浏览活动
    readActivity(){
        let {code} = this.props.params;
        ActivityCtr.readActivity(code).then(() => {}).catch(() => {});
    }
    goBack(){
        if(window.history.length == 1){
            Util.goPath('/list');
        }else{
            if(sessionStorage["out"]){
                sessionStorage.removeItem("out");
                Util.goPath('/list');
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
                            imgUrl: Util.getShareImg(activity.pic1),
                            description: Util.clearTag(activity.description)
                        }
                    });
                    window.webkit.messageHandlers.webviewEvent.postMessage(json);
                }else if(window.android){
                    window.android.share(
                        location.href,
                        activity.title,
                        Util.clearTag(activity.description),
                        Util.getShareImg(activity.pic1)
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
                                    <Swipe data={activity.pic1}/>
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
