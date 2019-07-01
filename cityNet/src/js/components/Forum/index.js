import React, {Component} from 'react';
import {Link} from 'react-router';
import './index.scss';
import Tloader from 'react-touch-loader';
import {Toast} from 'antd-mobile';
import className from 'classnames';
import RichHeader from '../../components/RichHeader';
import Nav from '../../components/Nav';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {MenuCtr} from '../../controller/MenuCtr';
import {PostCtr} from '../../controller/PostCtr';

const Util = require('../../util/util');
const commentIcon = require('../../../images/评论－无边框@2x.png');
const DZIcon = require('../../../images/点赞无边框@2x.png');

export default class Forum extends Component {
    constructor(){
        super();
        this.state = {
            activeIndex: 0,
            company: null,
            leftNavData: [],
            rightBlockData: []
        };
        this.company = Util.getCompany();
    }
    componentDidMount(){
        Util.showLoading();
        let {menuData} = this.props;
        !menuData.length && this.getMenuList();
        // 先获取大板块的信息，之后默认取第一个大板块获取小板块
        PostCtr.getBigBlockList(true)
            .then((data) => {
                data.length && this.getRightNavList(data[0].code, true) || Util.hideLoading();
                this.setState({leftNavData: data});
            }).catch(() => {});
        this.getInitWXSDKConfig();
        GeneralCtr.recordPageView();
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
        let me = this;
        wx.ready(() => {
            let link = location.href,
                title = "论坛",
                desc = Util.clearTag(this.company.description),
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
    // 点击大板块获取小板块数据
    handleLeftNavClick(index, e){
        e.preventDefault();
        e.stopPropagation();
        let {activeIndex, leftNavData} = this.state;
        if(activeIndex != index){
            Util.showLoading();
            this.getRightNavList(leftNavData[index].code);
            this.setState({
                activeIndex: index
            });
        }
    }
    // 根据大板块，获取小板块
    getRightNavList(parentCode, refresh){
        PostCtr.getBlockByParentCode(parentCode, refresh)
            .then((data) => {
                this.setState({rightBlockData: Util.bubbleSort(data, "orderNo")});
                Util.hideLoading();
            }).catch(() => {});
    }
    // 获取菜单列表
    getMenuList(refresh) {
        return MenuCtr.getMenuList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.props.updateMenu(data);
            });
    }
    render(){
        let {leftNavData, rightBlockData, activeIndex} = this.state;
        return (
            <div class="box">
                <RichHeader activeNavIndex={1}/>
                <div class="tloaderDiv">
                    <div class="classify" style={{marginBottom: "0"}}>
                        <ul class="classify-url" style={{overflow: "auto", display: "inline-block"}}>
                            {
                                leftNavData && leftNavData.map((nav, index) => (

                                    <li key={`left${index}`} class={
                                        className({
                                            "active": activeIndex == index
                                        })
                                    } onClick={this.handleLeftNavClick.bind(this, index)}>{nav.name}</li>
                                ))
                            }
                        </ul>
                        <div class="classify-list">
                            <div class="moudleList">
                                <ul>
                                    {
                                        rightBlockData && rightBlockData.map((block, index) => (
                                            <li key={`right${index}`}>
                                                <Link to={`/forum?code=${block.code}`}>
                                                    <div class="moudleImg"><img src={Util.formatImg(block.pic)} alt=""/></div>
                                                    <p>{block.name}</p>
                                                    <div class="moudle-ion">
                                                        <div><img src={DZIcon} alt=""/> <span>{block.allLikeNum || 0}</span></div>
                                                        <div><img src={commentIcon} alt=""/> <span>{block.allCommentNum || 0}</span></div>
                                                    </div>
                                                    <span class="moudle-enter">进入</span>
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Nav chatRoomData={this.props.chatRoomData} menuData={this.props.menuData} activeIndex={1}/>
            </div>
        );
    }
}
