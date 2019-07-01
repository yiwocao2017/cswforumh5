import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../components/NormalHeader';
import Nav from '../../components/Nav';
import Tloader from 'react-touch-loader';
import {globalInfo} from '../../containers/App';
import {Badge} from 'antd-mobile';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {PostCtr} from '../../controller/PostCtr';
import {UserCtr} from '../../controller/UserCtr';
import {MenuCtr} from '../../controller/MenuCtr';
import './index.scss';

const Util = require('../../util/util');

const rightIcon = require('../../../images/_pic.png');

export default class User extends Component {
    constructor() {
        super();
        this.state = {
            initializing: 1,
            refreshedAt: Date.now(),
            totalPost: 0,               //  帖子总数
            amount: 0,                  //  赏金总数
            user: {
                userExt: {}
            },
            userRank: "",               //  用户等级
            isBlockManager: 0
        }
    }
    componentDidMount(){
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.showLoading();
        let {menuData} = this.props;
        !menuData.length && this.getMenuList();
        Promise.all([
            this.init(),
            this.getBlockByUserId()
        ]).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    init(){
        return Promise.all([
            this.getUserInfoAndUserRank(),
            this.getTotalPost(),
            this.getAccount()
        ]);
    }
    // 获取菜单列表
    getMenuList(refresh) {
        return MenuCtr.getMenuList(Util.getCompanyCode(), refresh)
            .then((data) => {
                this.props.updateMenu(data);
            });
    }
    // 获取版主为当前用户的板块列表
    getBlockByUserId(){
        return PostCtr.getBlockByUserId(true)
            .then((data) => {
                if(data.length){
                    this.setState({isBlockManager: 1});
                }
            });
    }
    // 获取用户详情 和 等级列表
    getUserInfoAndUserRank(){
        return Promise.all([
            this.getUserInfo(),
            // 获取等级列表
            UserCtr.getUserRank()
        ]).then((data) => {
            let [userInfo, rankInfo] = data;
            rankInfo = rankInfo.list;
            let userRank, secondRank;
            rankInfo.forEach((rank) => {
                if(rank.code == userInfo.level && userInfo.level != "0"){
                    userRank = rank.name;
                }
                if(rank.code == "1"){
                    secondRank = rank.name;
                }
            });
            userRank = userRank || secondRank;
            this.setState({userRank});
        })
    }
    // 获取用户详情
    getUserInfo(){
        return UserCtr.getUserInfo()
            .then((data) => {
                this.setState({user: data});
                globalInfo.user = data;
                return data;
            });
    }
    // 获取帖子总数
    getTotalPost(){
        return UserCtr.getTotalPost(true)
            .then((data) => this.setState({totalPost: data || 0}));
    }
    // 获取账户信息
    getAccount(){
        return UserCtr.getAccount(true)
            .then((data) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].currency == "JF"){
                        this.setState({amount: data[i].amount});
                        break;
                    }
                }
            });
    }
    // 刷新页面
    handleRefresh(resolve) {
        this.init(true).then(resolve).catch(resolve);
    }
    // 进入我的活动页面
    goMyActivity(e){
        e.stopPropagation();
        e.preventDefault();
        Util.goPath('/orders');
        // location.href = ACTIVITY_URL + '?comp=' + Util.getCompany().code + '&tk=' + localStorage["token"] + '#/orders';
    }
    render(){
        let {initializing, totalPost, user, amount, isBlockManager, userRank} = this.state;
        let noReadCount = 0;
        if(Util.isLogin()){
            let chatRoomData = this.props.chatRoomData || {};
            let userId = Util.getUserId();
            noReadCount = chatRoomData[userId] && chatRoomData[userId].noReadCount || 0;
        }
        return (
            <div class="box">
                <NormalHeader hideBack={true} title='我的'/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} className="tloader headline">
                    <div class="mine-detail">
                        <div class="mine-detail-header">
                            <div class="picDetail">
                                <Link to={`/user/${localStorage["userId"]}`}>
                                    <div class="pic_detail">
                                        <div class="pic">
                                            <img src={Util.formatUserCenter(user.userExt.photo)} alt=""/>
                                        </div>
                                        <div class="picName">
                                            <p class="username">{user.nickname}</p>
                                            <p class="userRank">{userRank}</p>
                                        </div>
                                    </div>
                                    <img class="_pic" src={rightIcon} alt=""/>
                                </Link>
                            </div>
                            <div class="mine-detail-header-num">
                                <ul>
                                    <li><Link to='/user/plist'><div>{totalPost}</div><p>帖子</p></Link></li>
                                    <li><Link to='/user/fansOrAttention/0'><div>{user.totalFollowNum || 0}</div><p>关注</p></Link></li>
                                    <li><Link to='/user/fansOrAttention/1'><div>{user.totalFansNum || 0}</div><p>粉丝</p></Link></li>
                                    <li><Link to='/user/reward'><div>{amount ? Util.formatMoney(amount) : 0}</div><p>赏金</p></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div class="mine-detail-content">
                            <ul>
                                <li><Link to={`/user/commodity/list`}>
                                    <div class="goods"></div>
                                    <span class="mine-detail-span">我的物品</span>
                                    <img src={rightIcon} alt=""/>
                                </Link></li>
                                <li onClick={this.goMyActivity.bind(this)}>
                                    <div class="m-activity"></div>
                                    <span class="mine-detail-span">我的活动</span>
                                    <img src={rightIcon} alt=""/>
                                </li>
                                <li><Link to={`/user/collection`}>
                                    <div class="collect"></div>
                                    <span class="mine-detail-span">我的收藏</span>
                                    <img src={rightIcon} alt=""/>
                                </Link></li>
                                <li><Link to={`/user/draft`}>
                                    <div class="draft"></div>
                                    <span class="mine-detail-span">草稿箱</span>
                                    <img src={rightIcon} alt=""/>
                                </Link></li>
                                <li><Link to={`/user/message`}>
                                    <div class="msg"></div>
                                    <span class="mine-detail-span">我的消息</span>
                                    <img src={rightIcon} alt=""/>
                                    {noReadCount ? <Badge text={noReadCount} style={{backgroundColor: '#d23e3e'}} /> : ""}
                                </Link></li>
                                {
                                    isBlockManager
                                        ? <li><Link to={`/user/block`}>
                                            <div class="myblock"></div>
                                            <span class="mine-detail-span">我的板块</span>
                                            <img src={rightIcon} alt=""/>
                                        </Link></li> : ""
                                }
                                <li><Link to={`/user/aboutus`}>
                                    <div class="aboutCity"></div>
                                    <span class="mine-detail-span">关于城市网</span>
                                    <img src={rightIcon} alt=""/>
                                </Link></li>
                                <li><Link to={`/user/setting`}>
                                    <div class="set"></div>
                                    <span class="mine-detail-span">设置</span>
                                    <img src={rightIcon} alt=""/>
                                </Link></li>
                            </ul>
                        </div>
                    </div>
                </Tloader>
                <Nav chatRoomData={this.props.chatRoomData} menuData={this.props.menuData} activeIndex={4}/>
            </div>
        );
    }
}
