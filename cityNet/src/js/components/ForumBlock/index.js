import React, {Component} from 'react';
import Tloader from 'react-touch-loader';
import {Toast} from 'antd-mobile';
import NormalPostItem from '../NormalPostItem';
import ForumBlockHeader from './ForumBlockHeader';
import {Tabs} from 'antd-mobile';
import {globalInfo} from '../../containers/App';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {PostCtr} from '../../controller/PostCtr';
import './index.scss';

const TabPane = Tabs.TabPane;
const Util = require('../../util/util');

export default class ForumBlock extends Component {
    constructor() {
        super();
        this.state = {
            blockData: { //板块信息
                splate: {}
            },
            key: 0,
            limit0: 10,
            start0: 1,
            hasMore0: false,
            postData0: null,
            limit1: 10,
            start1: 1,
            hasMore1: false,
            postData1: null,
            limit2: 10,
            start2: 1,
            hasMore2: false,
            postData2: null,
            hasMore: false,
            initializing: 1
        };
        this.isLoading = false;
        this.isWxConfiging = false;
        this.wxData = null;
    }
    componentDidMount() {
        // 如果是当前页面就加载
        if(/#\/forum\?/.test(location.href)){
            this.initData();
        }
    }

    componentDidUpdate() {
        if(/#\/forum\?/.test(location.href)){
            if(document.title != "板块详情"){
                Util.setTitle("板块详情");
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

    initData(){
        let {initializing} = this.state;
        if(initializing !== 2 && !this.isLoading){
            this.isLoading = true;
            Util.showLoading();
            if (this.props.location.query.code) {
                this.getBlock().then((data) => {
                    this.getInitWXSDKConfig();
                }).catch(() => {});
                this.choseFetch(true)
                    .then(() => {
                        this.setState({
                            initializing: 2
                        });
                        this.isLoading = false;
                        Util.hideLoading();
                    }).catch(() => {});
            }
            GeneralCtr.recordPageView();
            this.addScrollListener();
        }
    }
    // 根据key判断调用哪个接口
    choseFetch(refresh){
        let {key} = this.state;
        if(key == 0)
            return this.getAllPagePost(refresh);
        if(key == 1)
            return this.getLatestPagePost(refresh);
        return this.getJHPagePost(refresh);
    }
    // 添加页面滚动事件
    addScrollListener(){
        this.tloader.refs.panel.onscroll = () => {
            // 变量t就是滚动条滚动时，到顶部的距离
            const k=20;
            const t = this.tloader.refs.panel.scrollTop;
            const top_view = document.getElementById('top');
            if (top_view !== null) {
                if(t>k){top_view.style.display = t >= 100 ? 'block' : 'none';}
                if(t<k){top_view.style.display = t >= 100 ? 'block' : 'none';}

            }
        };
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
            let {blockData} = this.state;
            let link = location.href,
                title = blockData.splate.name,
                desc = blockData.splate.description || title,
                imgUrl = Util.getActivityShareImg(blockData.splate.pic);

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


    // 返回顶部
    scrollToTop (e) {
        e.stopPropagation();
        e.preventDefault();
        this.tloader.refs.panel.scrollTop = 0;
    }
    // tab change事件
    handleChange(key){
        this.setState({key});
        let {postData0, postData1, postData2} = this.state;
        if(key == 0 && !postData0){
            this.setState({
                hasMore: false
            });
            Util.showLoading();
            this.getAllPagePost(true).then(Util.hideLoading).catch(() => {});
        }else if(key == 1 && !postData1){
            this.setState({
                hasMore: false
            });
            Util.showLoading();
            this.getLatestPagePost(true).then(Util.hideLoading).catch(() => {});
        }else if(key == 2 && !postData2){
            this.setState({
                hasMore: false
            });
            Util.showLoading();
            this.getJHPagePost(true).then(Util.hideLoading).catch(() => {});
        }
    }
    // 获取板块详情
    getBlock() {
        return PostCtr.getBlockDetail(this.props.location.query.code, true)
            .then((data) => {
                this.setState({
                    blockData: data
                });
                return data;
            });
    }
    // 上拉加载更多
    handleLoadMore(resolve) {
        let {key} = this.state;
        if(key == 0)
            this.getAllPagePost().then(resolve).catch(resolve);
        else if(key == 1)
            this.getLatestPagePost().then(resolve).catch(resolve);
        else
            this.getJHPagePost().then(resolve).catch(resolve);
    }
    // 分页获取全部帖子
    getAllPagePost(refresh){
        let {start0, limit0} = this.state;
        start0 = refresh && 1 || start0;
        return PostCtr.getPagePost({
            start: start0,
            limit: limit0,
            orderDir: 'asc',
            orderColumn: 'order_no',
            plateCode: this.props.location.query.code,
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit0 || 0;
            let {postData0} = this.state;
            postData0 = refresh && [] || postData0;
            postData0 = [].concat.call(postData0, data.list);
            hasMore && start0++;
            this.setState({
                hasMore,
                hasMore0: hasMore,
                start0,
                postData0
            });
        });
    }
    // 分页获取最新帖子
    getLatestPagePost(refresh){
        let {start1, limit1} = this.state;
        start1 = refresh && 1 || start1;
        return PostCtr.getPagePost({
            start: start1,
            limit: limit1,
            orderDir: 'desc',
            orderColumn: 'publish_datetime',
            plateCode: this.props.location.query.code
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit1 || 0;
            let {postData1} = this.state;
            postData1 = refresh && [] || postData1;
            postData1 = [].concat.call(postData1, data.list);
            hasMore && start1++;
            this.setState({
                hasMore,
                hasMore1: hasMore,
                start1,
                postData1
            });
        })
    }
    // 分页获取精华帖子
    getJHPagePost(refresh){
        let {start2, limit2} = this.state;
        start2 = refresh && 1 || start2;
        return PostCtr.getPagePost({
            start: start2,
            limit: limit2,
            orderDir: 'asc',
            orderColumn: 'order_no',
            location: "B",
            plateCode: this.props.location.query.code
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit2 || 0;
            let {postData2} = this.state;
            postData2 = refresh && [] || postData2;
            postData2 = [].concat.call(postData2, data.list);
            hasMore && start2++;
            this.setState({
                hasMore,
                hasMore2: hasMore,
                start2,
                postData2
            });
        })
    }
    handleRefresh(resolve) {
        let {key} = this.state;
        if(key == 0)
            this.getAllPagePost(true).then(resolve).catch(resolve);
        else if(key == 1)
            this.getLatestPagePost(true).then(resolve).catch(resolve);
        else
            this.getJHPagePost(true).then(resolve).catch(resolve);
    }
    // 点赞
    handleLikeClick(item){
        let {key, postData0, postData1, postData2} = this.state;
        let postData = key == 0 ? postData0 : key == 1 ? postData1 : postData2;

        let index = Util.findItemInArr(postData, item, "code");
        if(index != -1){
            if(item.isDZ == "0"){
                postData[index].isDZ = "1";
                postData[index].sumLike = +item.sumLike + 1;
                postData[index].likeList.push({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname
                });
            }else{
                postData[index].isDZ = "0";
                postData[index].sumLike = +item.sumLike - 1;
                let likeList = postData[index].likeList || [];
                let likeIndex = Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker");
                if(likeIndex != -1){
                    likeList.splice(likeIndex, 1);
                }
                postData[index].likeList = likeList;
            }
            if(key == 0){
                this.setState({postData0: postData});
            }else if(key == 1){
                this.setState({postData1: postData});
            }else{
                this.setState({postData2: postData});
            }
        }
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
        let {
            blockData, //板块信息
        } = this.state;
        let {postData0, postData1, postData2, initializing, hasMore} = this.state;
        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <ForumBlockHeader title='板块详情' code={blockData.splate.code}/>
                    <Tloader ref={(tloader) => this.tloader = tloader} initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                        <div class="themeHeader">
                            <div class="themePic"><img src={Util.formatImg(blockData.splate.pic)} alt=""/></div>
                            <p class="themeTopic">{blockData.splate.name}</p>
                            <p class="themeNums">主题：<span class="themeNum">{blockData.allPostCount || 0}</span> 今日：<span class="todayNum">{blockData.todayPostCount || 0}</span></p>
                        </div>
                        <Tabs defaultActiveKey="0" animated={false} class="" onChange={this.handleChange.bind(this)}>
                            <TabPane tab="全部" key="0">
                                    <div class="rich_list">
                                        <ul>{
                                            postData0 && postData0.length ? postData0.map((data, index) => (
                                                <NormalPostItem
                                                    key={data.code}
                                                    pData={data}
                                                    showCarousel={this.props.showCarousel}
                                                    handleLikeClick={this.handleLikeClick.bind(this)}
                                                    toUrl="/forum"
                                                />
                                            )) : Util.noData("暂无帖子")
                                        }</ul>
                                    </div>
                            </TabPane>
                            <TabPane tab="最新" key="1">
                                <div class="rich_list">
                                    <ul>{
                                        postData1 && postData1.length ? postData1.map((data, index) => (
                                            <NormalPostItem
                                                key={data.code}
                                                pData={data}
                                                showCarousel={this.props.showCarousel}
                                                handleLikeClick={this.handleLikeClick.bind(this)}
                                                toUrl="/forum"
                                            />
                                        )) : Util.noData("暂无帖子")
                                    }</ul>
                                </div>
                            </TabPane>
                            <TabPane tab="精华" key="2">
                                <div class="rich_list">
                                    <ul>{
                                        postData2 && postData2.length ? postData2.map((data, index) => (
                                            <NormalPostItem
                                                key={data.code}
                                                pData={data}
                                                showCarousel={this.props.showCarousel}
                                                handleLikeClick={this.handleLikeClick.bind(this)}
                                                toUrl="/forum"
                                            />
                                        )) : Util.noData("暂无帖子")
                                    }</ul>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Tloader>
                    <div onClick={this.scrollToTop.bind(this)} className="top" id="top">UP</div>

                </div> {this.renderChildren()} </div>
        );
    }
}
