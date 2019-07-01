import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import {Toast} from 'antd-mobile';
import NormalHeader from '../NormalHeader';
import {GeneralCtr} from '../../controller/GeneralCtr';
import './index.scss';

const Util = require('../../util/util');

export default class IframeWin extends Component {
    constructor(){
        super();
        this.state = {
            initializing: 1
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getInitWXSDKConfig();
    }
    handleLoad(){
        Util.hideLoading();
        this.setState({initializing: 2});
    }
    // 获取微信初始化的参数
    getInitWXSDKConfig() {
        GeneralCtr.getInitWXSDKConfig()
            .then((data) => {
                this.initWXSDK(data);
            }).catch(() => {});
    }
    // 初始化微信参数
    initWXSDK(data) {
        wx.config({
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                    "checkJsApi",
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareQZone"
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(() => {
            let link = location.href,
                title = this.props.location.query.title,
                desc = this.props.location.query.title,
                imgUrl = Util.getActivityShareImg(this.props.location.query.imgsrc);

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
    render() {
        return (
            <div class="box">
                <NormalHeader title={this.props.location.query.title}/>
                <Tloader initializing={this.state.initializing} className="tloader headNoBottom iframe-loader">
                    <iframe width="100%" height="100%" onLoad={this.handleLoad.bind(this)} src={this.props.location.query.url}></iframe>
                </Tloader>
            </div>
        );
    }
}
