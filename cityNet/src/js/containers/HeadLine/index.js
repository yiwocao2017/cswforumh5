import React, {Component} from 'react';
import {Link} from 'react-router';
import HeadLineHeader from '../../components/HeadLineHeader';
import Nav from '../../components/Nav';
import SmallImgBlocks from '../../components/SmallImgBlocks';
import Swipe from '../../components/Swipe';
import CityChoseList from './CityChoseList';
import HeadLinePosts from './HeadLinePosts';
import SignIn from './SignIn';
import Tloader from 'react-touch-loader';
import {Toast, Flex} from 'antd-mobile';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {PostCtr} from '../../controller/PostCtr';
import {UserCtr} from '../../controller/UserCtr';
import {MenuCtr} from '../../controller/MenuCtr';
import './index.scss';

const Item = Flex.Item;
const Util = require('../../util/util');

export default class HeadLine extends Component {
    constructor() {
        super();
        this.state = {
            showSignIn: 0, //是否显示签到页面
            isSignSuccess: 0, //是否签到成功
            signAmount: 0, //签到成功后送的积分
            showDropList: 0, //是否显示城市下拉列表
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),
            choseCity: Util.getCompany(), //当前选择的城市{code,name}
            postData: [], //帖子数据
            subSystemData: [], //11个子系统数据
            swiperData: [], //banner数据
            cityListData: [] //城市列表数据
        };
        this.isLoading = false;
        this.isWxConfiging = false;
        this.wxData = null;
    }
    componentDidMount() {
        // 如果是当前页面就加载
        if(/#\/home\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate() {
        if(/#\/home\?/.test(location.href)){
            if(document.title != "头条"){
                Util.setTitle("头条");
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
            let {menuData} = this.props;
            !menuData.length && this.getMenuList();
            Util.showLoading("加载中...");
            this.init()
                .then(() => {
                    this.setState({
                        initializing: 2
                    });
                    this.isLoading = false;
                    Util.hideLoading();
                }).catch(() => {});
            this.getInitWXSDKConfig();
            GeneralCtr.recordPageView();
        }
    }
    // 页面初始化需要获取的数据
    init(refresh = false) {
        return Promise.all([
            this.getModuleList(refresh),
            this.getBannerList(refresh),
            this.getPagePost(refresh)
        ]);
    }
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
                title = "头条",
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
    // 获取11个模块列表
    getModuleList(refresh) {
        return MenuCtr.getModuleList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.setState({
                    subSystemData: data
                });
            });
    }
    // 获取banner列表
    getBannerList(refresh) {
        return MenuCtr.getBannerList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.setState({
                    swiperData: data
                });
            });
    }
    // 获取菜单列表
    getMenuList(refresh) {
        return MenuCtr.getMenuList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.props.updateMenu(data);
            });
    }
    // 分页获取帖子列表
    getPagePost(refresh) {
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPagePost({
            start,
            limit,
            location: "C"
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData} = this.state;
            postData = refresh && [] || postData;
            postData = [].concat.call(postData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                postData
            });
        });
    }
    // 获取城市列表
    getCompanyList() {
        return UserCtr.getCompanyList();
    }
    // 加载更多帖子
    handleLoadMore(resolve) {
        this.getPagePost()
            .then(resolve).catch(resolve);
    }
    // 刷新数据
    handleRefresh(resolve) {
        this.init(true)
            .then(resolve).catch(resolve);
    }
    // 点击页面头部城市选中按钮
    handleDropClick() {
        Util.showLoading();
        this.getCompanyList()
            .then((data) => {
                Util.hideLoading();
                this.setState({
                    showDropList: 1,
                    cityListData: data
                });
            }).catch(() => {});
    }
    // 处理选择城市的click事件
    handleCityChoseClick(city) {
        this.setState({
            choseCity: city,
            showDropList: 0
        });
        if(city.code !== Util.getCompanyCode()){
            Util.setCompany(city);
            Util.showLoading();
            Promise.all([
                this.init(true),
                this.getMenuList()
            ]).then(() => {
                Util.hideLoading();
            }).catch(() => {});
        }
    }
    // 关闭城市选择列表
    handleChoseCityCancel() {
        this.setState({
            showDropList: 0
        });
    }
    // 签到点击事件
    handleSignInClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!Util.isLogin()) {
            Util.goLogin();
            return;
        }
        GeneralCtr.signIn()
            .then((data) => {
                let amount = +data.amount || 0;
                amount = amount == 0 ? 0 : +Util.formatMoney(data.amount);
                this.setState({
                    showSignIn: 1,
                    isSignSuccess: 1,
                    signAmount: amount
                });
            }).catch(() => {
                Util.hideLoading();
                this.setState({
                    showSignIn: 1,
                    isSignSuccess: 0
                });
            })
    }
    // 同城活动
    handleActivityClick(e) {
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/activity');
    }
    // 隐藏签到页面
    hideSignIn() {
        this.setState({
            showSignIn: 0
        });
    }
    // 把11个子系统按3+8分类
    get3And8ModuleArr(subSystemData = []) {
        subSystemData = Util.bubbleSort(subSystemData, "orderNo");
        let threeModuleArr = [],
            eightModuleArr = [];
        for (let i = 0; i < subSystemData.length; i++) {
            if (subSystemData[i].location == "0") {
                threeModuleArr.push(subSystemData[i]);
            } else {
                eightModuleArr.push(subSystemData[i]);
            }
        }
        return {
            threeModuleArr,
            eightModuleArr
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
            hasMore, //是否有更多帖子
            initializing, //初始化状态
            refreshedAt, //刷新时间
            postData, //帖子数据
            swiperData, //banner图
            subSystemData, //11个子系统数据
            showDropList, //是否显示城市选择列表
            choseCity, //当前选则的城市
            showSignIn, //是否显示签到页面
            isSignSuccess, //签到是否成功
            cityListData, //城市选择列表的数据
            signAmount, //签到成功后赠送的积分数
        } = this.state;
        let {
            menuData, //底部菜单数据
            chatRoomData, //聊天记录
            updateMenu
        } = this.props;

        let allModuleArr = this.get3And8ModuleArr(subSystemData);
        let threeModuleArr = allModuleArr.threeModuleArr; //  三个模块
        let eightModuleArr = allModuleArr.eightModuleArr; //  八个模块
        let threeModuleTmpl = []
        for (let i = 0; i < threeModuleArr.length; i++) {
            let result = Util.parseSubSystemUrl(threeModuleArr[i].url);
            // 外部链接 或 同城活动
            if (result.outUrl) {
                threeModuleTmpl.push(
                    <Item key={`index${i}`} class="threeModule">
                        {/*  <img src={Util.formatImg(threeModuleArr[i].pic)}/> */}
                        <a href={result.url} class="a3">{threeModuleArr[i].name}</a>
                    </Item>
                );
            } else {
                if (result.signin) {
                    threeModuleTmpl.push(
                        <Item key={`index${i}`} className="threeModule" onClick={this.handleSignInClick.bind(this)}>
                            <a href="jacascript:void(0)" class="a2">{threeModuleArr[i].name}</a>
                        </Item>
                    );
                } else if (result.activity) {
                    threeModuleTmpl.push(
                        <Item key={`index${i}`} className="threeModule" onClick={this.handleActivityClick.bind(this)}>
                            <a href="jacascript:void(0)" class="a3">{threeModuleArr[i].name}</a>
                        </Item>
                    );
                } else {
                    threeModuleTmpl.push(
                        <Item key={`index${i}`} class="threeModule">
                            <Link to={result.url} class="a1">{threeModuleArr[i].name}</Link>
                        </Item>
                    );
                }
            }
        };
        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <HeadLineHeader handleDropClick={this.handleDropClick.bind(this)} title={choseCity.name} pageTitle="头条"/>
                    <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="headline">
                        <div className="headerLine-detail">
                            <div className="sliderPic">
                                <Swipe data={swiperData}/>
                            </div>
                            <div className="headerLine-nav">
                                <Flex className="headerLine-nav-header" justify="between">
                                    {threeModuleTmpl}
                                </Flex>
                                <SmallImgBlocks handleActivityClick={this.handleActivityClick.bind(this)} handleSignInClick={this.handleSignInClick.bind(this)} imgsData={eightModuleArr}/>
                                <HeadLinePosts postData={postData}/>
                            </div>
                        </div>
                    </Tloader>
                    <Nav chatRoomData={chatRoomData} menuData={menuData} activeIndex={0}/>
                    {showDropList
                        ? <CityChoseList cityListData={cityListData} handleCityChoseClick={this.handleCityChoseClick.bind(this)} handleChoseCityCancel={this.handleChoseCityCancel.bind(this)}/>
                        : ""}
                    {showSignIn
                        ? <SignIn amount={signAmount} hideSignIn={this.hideSignIn.bind(this)} isSignSuccess={isSignSuccess}/>
                        : ""}
                </div> {
                this.renderChildren()
            } < /div>
        )
    }
}
