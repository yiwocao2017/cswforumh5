import React, {Component} from 'react';
import {Tabs, Toast} from 'antd-mobile';
import RichHeader from '../../components/RichHeader';
import Nav from '../../components/Nav';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {MenuCtr} from '../../controller/MenuCtr';
import className from 'classnames';
import RichPosts from './RichPosts';
import './index.scss';

const TabPane = Tabs.TabPane;
const Util = require('../../util/util');

export default class Rich extends Component {
    constructor() {
        super();
        this.state = {
            key: 0,
            initStatus: 0
        };
        this.isWxConfiging = false;
        this.wxData = null;
        this.isLoading = false;
    }
    componentDidMount(){
        // 如果是当前页面就加载
        if(/#\/rich\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate(){
        if(document.title != "有料" && /#\/rich\?/.test(location.href)){
            Util.setTitle("有料");
        }
        if(/#\/rich\?/.test(location.href)){
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
    initData(){
        let {initStatus} = this.state;
        if(initStatus !== 1 && !this.isLoading){
            this.isLoading = true;
            let {menuData} = this.props;
            if(!menuData.length){
                this.getMenuList()
                    .then(() => {
                        this.setState({initStatus: 1});
                        this.isLoading = false;
                    })
            }
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
                title = "有料",
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
    // 获取菜单列表
    getMenuList(refresh) {
        return MenuCtr.getMenuList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.props.updateMenu(data);
            });
    }
    // tab的change事件
    handleChange(key){
        this.setState({key});
    }
    // 生成子元素，并传入相关参数
    renderChildren() {
        //遍历所有子组件
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                //把父组件的props赋值给每个子组件
                showCarousel: this.props.showCarousel
            })
        })
    }
    render() {
        let {key} = this.state;

        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <RichHeader activeNavIndex={0}/>
                    <Tabs defaultActiveKey="0" animated={false} class="rich-sub-header" onChange={this.handleChange.bind(this)}>
                        <TabPane tab="最新发布" key="0">
                            <RichPosts showCarousel={this.props.showCarousel} location=""/>
                        </TabPane>
                        <TabPane tab="置顶贴" key="1">
                            <RichPosts showCarousel={this.props.showCarousel} location="A"/>
                        </TabPane>
                        <TabPane tab="精华贴" key="2">
                            <RichPosts showCarousel={this.props.showCarousel} location="B"/>
                        </TabPane>
                    </Tabs>
                    <Nav chatRoomData={this.props.chatRoomData} menuData={this.props.menuData} activeIndex={1}/>
                </div>
                {this.renderChildren()}
            </div>
        )
    }
}
