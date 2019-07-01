import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../NormalHeader';
import NormalPostItem from '../../NormalPostItem';
import {Flex} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');

const girlIcon = require('../../../../images/女@2x.png');
const boyIcon = require('../../../../images/男.png');
const messageIcon = require('../../../../images/message.png');
const addIcon = require('../../../../images/addIcon.png');
const cancelIcon = require('../../../../images/cancel.png');
const editIcon = require('../../../../images/edit.png');

export default class UserCenter extends Component {
    constructor() {
        super();
        this.state = {
            isMine: 1,                  //是否是自己
            isFriend: 0,                //是否已经关注
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            postData: [],               //帖子列表
            user: {                     //当前用户的信息
                userExt: {}
            },
            totalPost: 0                //帖子总数
        };
        this.isLoading = false;
    }
    componentDidMount() {
        if(/#\/user\/[^\/\?]+\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate(){
        if(/#\/user\/[^\/\?]+\?/.test(location.href)){
            if(document.title != "个人主页"){
                Util.setTitle("个人主页");
            }
            this.initData();
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.params.userId !== this.props.params.userId){
            let isMine = 0;
            if(Util.getUserId() == nextProps.params.userId)
                isMine = 1;
            this.init(nextProps.params.userId, isMine).then(() => this.setState({ isMine }));
        }
    }
    // 页面初始化的逻辑代码
    initData(){
        let {initializing} = this.state;
        if(initializing !== 2 && !this.isLoading){
            this.isLoading = true;
            Util.showLoading();
            let isMine = Util.getUserId() == this.props.params.userId ? 1 : 0;
            this.setState({isMine});
            this.init(this.props.params.userId, isMine, this.state.start)
                .then(() => {
                    this.setState({initializing: 2});
                    this.isLoading = false;
                    Util.hideLoading();
                }).catch(() => {});
            GeneralCtr.recordPageView();
        }
    }
    init(userId, isMine, start){
        return Promise.all([
            this.getUserInfo(userId, isMine),
            this.getPagePost(userId, isMine, start, true),
            this.isFollowUser(userId)
        ])
    }

    // 获取用户详情805256
    getUserInfo(userId, isMine){
        UserCtr.getUserInfoByUserId(userId, true)
            .then((data) => {
                this.setState({user: data});
                if(isMine){
                    globalInfo.user = data;
                }
            });
    }
    // 分页获取帖子
    getPagePost(userId, isMine, start, refresh = false){
        let {limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPagePost({
            start,
            limit,
            orderDir: 'desc',
            orderColumn: 'publish_datetime',
            status: isMine ? 'NO_A' : 'BD',
            publisher: userId
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData} = this.state;
            postData = refresh && [] || postData;
            postData = [].concat.call(postData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                postData,
                totalPost: data.totalCount
            });
        });
    }
    // 判断是否关注用户
    isFollowUser(toUserId){
        let userId = Util.getUserId();
        if(userId){
            return UserCtr.isFollowUser(toUserId)
                    .then((data) => this.setState({isFriend: data}));
        }
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    handleLoadMore(resolve) {
        this.getPagePost(this.props.params.userId, this.state.isMine, this.state.start).then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPagePost(this.props.params.userId, this.state.isMine, this.state.start, true).then(resolve).catch(resolve);
    }
    // 编辑个人资料
    goEditUser(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.goPath('/user/editUserInfo');
    }
    // 关注用户
    followUser(e){
        e.stopPropagation();
        e.preventDefault();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.showLoading("关注中...");
        UserCtr.followUser(this.props.params.userId)
            .then(() => {
                Util.hideLoading();
                this.setState({isFriend: 1});
            }).catch(() => {});
    }
    // 取消关注
    unFollowUser(e){
        e.stopPropagation();
        e.preventDefault();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.showLoading("取消关注中...");
        UserCtr.unFollowUser(this.props.params.userId)
            .then(() => {
                Util.hideLoading();
                this.setState({isFriend: 0});
            }).catch(() => {});
    }
    // 私信
    goChat(e){
        e.stopPropagation();
        e.preventDefault();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.goPath(`/user/chatRoom/${this.props.params.userId}`);
    }
    // 点赞
    handleLikeClick(item){
        let {postData} = this.state,
            index = Util.findItemInArr(postData, item, "code");
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
            this.setState({postData});
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
    render(){
        let {hasMore, initializing, refreshedAt, postData, isMine, isFriend, user, totalPost} = this.state;
        let postItems = postData.map((data, index) => (
            <NormalPostItem
                key={`item${index}`}
                pData={data}
                showComment={true}
                handleLikeClick={this.handleLikeClick.bind(this)}
                showCarousel={this.props.showCarousel}
                toUrl={`/user/${this.props.params.userId}`}
            />
        ));
        return (
            <div>
                <div class="user-center-wrap box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <NormalHeader title='个人主页'/>
                    <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader usercenter-loader">
                        <div class="homepage-header">
                            <div class="homepage-header-content">
                                <div class="homepagePic"><img src={Util.formatUserCenter(user.userExt.photo)} alt=""/></div>
                                <div class="homepage-person"><span>{user.nickname} </span><img src={user.userExt.gender == "1" ? boyIcon : girlIcon} alt=""/> <span class="class">V{user.level}</span></div>
                                <div class="homepage-num"><p class="left">关注 <span>{user.totalFollowNum}</span></p><p class="right">粉丝 <span>{user.totalFansNum}</span></p></div>
                                <div class="introduce"><span class="introduceName">自我介绍：</span><span>{user.userExt.introduce || "你还没有自我介绍"}</span></div>
                            </div>
                        </div>
                        <p class="noteNum">{totalPost}个帖子</p>
                        <div class="rich_list">
                            <ul>{postItems}</ul>
                        </div>
                    </Tloader>
                    <div class="usercenter-footer">
                        {
                            isMine
                            ? ( <Flex justify="center" onClick={this.goEditUser.bind(this)}>
                                    <Flex.Item><img class="right-img" src={editIcon}/><span>编辑资料</span></Flex.Item>
                                </Flex>)
                            : ( <Flex justify="center">
                                    <Flex.Item>
                                        {
                                            isFriend
                                            ? <div onClick={this.unFollowUser.bind(this)} class="b_ccc_r"><img class="left-img cancel-img" src={cancelIcon}/><span>取消关注</span></div>
                                            : <div onClick={this.followUser.bind(this)} class="b_ccc_r"><img class="left-img" src={addIcon}/><span>关注</span></div>
                                        }
                                    </Flex.Item>
                                    <Flex.Item onClick={this.goChat.bind(this)}><img class="right-img" src={messageIcon}/><span>私信</span></Flex.Item>
                                </Flex>)
                        }
                    </div>
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}
