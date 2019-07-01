import React, {Component} from 'react';
import {Link} from 'react-router';
import {Toast} from 'antd-mobile';
import NormalHeader from '../../components/NormalHeader';
import Tloader from 'react-touch-loader';
import VideoItem from './VideoItem';
import {GeneralCtr} from '../../controller/GeneralCtr';
import './index.scss';

const Util = require('../../util/util');

export default class Video extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            videoList: []
        };
        this.isWxConfiging = false;
        this.wxData = null;
        this.isLoading = false;
    }
    componentDidMount() {
        if(/#\/video\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate(){
        if(/#\/video\?/.test(location.href)){
            if(document.title != "视频"){
                Util.setTitle("视频");
            }
            this.initData();
            // 当前页面,并且微信sdk未初始化
            if(!this.isWxConfiging && !this.wxData && !this.isLoading) {
                this.getInitWXSDKConfig();
            }
        }else{  // 进入活动页面后，置空微信的参数
            this.isWxConfiging = false;
            this.wxData = null;
        }
    }
    // 页面初始化的逻辑代码
    initData(){
        let {initializing} = this.state;
        if(initializing !== 2 && !this.isLoading){
            this.isLoading = true;
            Util.showLoading();
            this.getPageVideo().then(() => {
                this.setState({initializing: 2});
                this.isLoading = true;
                Util.hideLoading();
            }).catch(() => {});
            this.getInitWXSDKConfig();
            GeneralCtr.recordPageView();
        }
    }
    // 获取微信初始化的参数
    getInitWXSDKConfig() {
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
        let me = this;
        wx.ready(() => {
            let company = Util.getCompany();
            let link = location.href,
                title = "视频",
                desc = Util.clearTag(company.description),
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
    // 分页查询视频
    getPageVideo(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return GeneralCtr.getPageVideo({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {videoList} = this.state;
            videoList = refresh && [] || videoList;
            videoList = [].concat.call(videoList, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                videoList
            });
            if(videoList.length == 1){
                Util.showLoading();
            }
        })
    }
    handleLoadMore(resolve) {
        this.getPageVideo().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageVideo(true).then(resolve).catch(resolve);
    }
    // iframe onload事件
    handleLoad(){
        Util.hideLoading();
    }

    render() {
        let {hasMore, initializing, refreshedAt, videoList} = this.state;

        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <NormalHeader title="视频"/>
                    {
                        videoList.length !== 1
                            ?
                            <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="user-commodity tloader headNoBottom">
                                <div class="wp100 ptb10 commodity-user-list">
                                    {
                                        videoList.length
                                        ? <ul class="wp100 over-hide plr5 border-box">
                                            {
                                                videoList.map((item, index) => (
                                                    <VideoItem video={item} key={`index${index}`}/>
                                                ))
                                            }
                                        </ul>
                                        : <div class="tc">暂无视频</div>
                                    }

                                </div>
                            </Tloader>
                            :
                            <Tloader initializing={2} className="tloader headNoBottom iframe-loader">
                                <iframe onLoad={this.handleLoad.bind(this)} width="100%" height="100%" src={videoList[0].url}></iframe>
                            </Tloader>

                    }
                </div>
                {this.props.children}
            </div>
        );
    }
}
