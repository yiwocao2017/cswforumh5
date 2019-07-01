import React, {Component} from 'react';
import { WhiteSpace, ActionSheet, Modal, Toast } from 'antd-mobile';
import PostDetailHeader from './PostDetailHeader';
import CommentAndDZ from './CommentAndDZ';
import NormalHeader from '../NormalHeader';
import CommentBottom from './CommentBottom';
import PostPriceButton from './PostPriceButton';
import PostPriceUserList from './PostPriceUserList';
import CommentWindow from './CommentWindow';
import Tloader from 'react-touch-loader';
import {globalInfo} from '../../containers/App';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {PostCtr} from '../../controller/PostCtr';
import {UserCtr} from '../../controller/UserCtr';
import './index.scss';

const Util = require('../../util/util');

export default class PostDetail extends Component {
    constructor(){
        super();
        this.state = {
            limit: 10,
            start0: 1,      //  评论
            hasMore0: 0,
            start1: 1,      //  点赞
            hasMore1: 0,

            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            activeNavIndex: "0",        //评论和点赞的tabs当前激活的tab
            postData: null,             //帖子信息

            start_praise: 1,            //打赏的start
            limit_praise: 18,           //打赏每页获取的limit
            praiseData: [],             //部分打赏人信息
            totalPraise: 0,             //打赏人总数

            showComment: 0,             //是否显示评论框

            commentParentCode: "",      //评论对应对parentCode
            isPostComment: 1,           //是否是对帖子对评论
            isFollow: 0,                //是否关注
            publisherInfo: {},          //发帖人信息
            commentList: null,          //评论列表
            likeList: null,             //点赞列表
            replayNickname: "",         //回复某条评论所对应的nickname
            replayCommer: "",           //回复某条评论所对应的userId
        }
    }
    componentDidMount(){
        this.setState({commentParentCode: this.props.params.code});
        Util.showLoading();
        Promise.all([
            this.getPostDetail(true),
            this.getPageComment(true),
            this.getPagePraise(true)
        ]).then((values) => {
            this.setState({
                initializing: 2
            })
            let [post] = values;
            let publisher = post.publisher;
            this.isFollowUser(publisher);
            Util.hideLoading();
            this.getInitWXSDKConfig();
        }).catch(() => {});
        Util.isLogin() && this.readPost();
        GeneralCtr.recordPageView();
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
            let {postData} = this.state;
            let link = location.href,
                title = postData.title,
                desc = postData.content,
                imgUrl = Util.getShareImg(postData);
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
        })
    }
    // 是否关注用户
    isFollowUser(toUser){
        if(Util.isLogin()){
            UserCtr.isFollowUser(toUser)
                .then((data) => this.setState({isFollow: data}))
                .catch(() => {});
        }
    }
    // 阅读帖子
    readPost(){
        PostCtr.readPost(this.props.params.code)
            .then(() => {})
            .catch(() => {})
    }
    // 获取帖子详情
    getPostDetail(refresh){
        return PostCtr.getPostDetail(this.props.params.code, refresh)
            .then((postData) => {
                this.setState({postData});
                return postData;
            });
    }
    // 分页获取打赏列表
    getPagePraise(refresh){
        let {code} = this.props.params;
        let {start_praise, limit_praise} = this.state;
        return PostCtr.getPagePostPraise({
            postCode: code,
            start: start_praise,
            limit: limit_praise
        }, refresh).then((data) => {
            this.setState({
                praiseData: data.list,
                totalPraise: data.totalCount
            });
        });
    }
    // 打赏成功后的回调
    handlePraiseCallback(){
        let {praiseData, totalPraise} = this.state;
        praiseData = praiseData || [];
        praiseData.push({
            talker: Util.getUserId(),
            photo: globalInfo.user.userExt.photo
        });
        totalPraise = +totalPraise + 1;
        this.setState({
            totalPraise,
            praiseData
        });
    }
    // 评论和点赞列表切换
    handleChange(key){
        this.setState({
            activeNavIndex: key
        });
        let {commentList, likeList, hasMore0, hasMore1} = this.state;
        if(key == "0"){ //  评价
            this.setState({
                hasMore: hasMore0
            });
            if(!commentList){
                this.getPageComment(true);
            }
        }else{  // 点赞
            this.setState({
                hasMore: hasMore1
            });
            if(!likeList){
                this.getPageLike(true);
            }
        }
    }
    // 分页获取评论
    getPageComment(refresh){
        let {start0, limit} = this.state;
        return PostCtr.getPageComment({
            postCode: this.props.params.code,
            start: start0,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {commentList} = this.state;
            commentList = refresh && [] || commentList;
            commentList = [].concat.call(commentList, data.list);
            hasMore && start0++;
            this.setState({
                hasMore,
                start0,
                commentList
            });
        });
    }
    // 分页获取点赞
    getPageLike(refresh){
        let {start1, limit} = this.state;
        return PostCtr.getPageLike({
            userId: this.state.postData.publisher,
            postCode: this.props.params.code,
            start: start1,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {likeList} = this.state;
            likeList = refresh && [] || likeList;
            likeList = [].concat.call(likeList, data.list);
            hasMore && start1++;
            this.setState({
                hasMore,
                start1,
                likeList
            });
        }).catch(() => {});
    }
    // 评论后，把成功的评论加入页面
    addComment(comment){
        if(/;filter:true/.test(comment.code)){
            Toast.info("评论内容中包含敏感字符", 2);
        }else{
            let {isPostComment, commentList, postData} = this.state;
            commentList = commentList || [];
            // if(isPostComment){
                comment.nickname = globalInfo.user.nickname;
            // }
            comment.postCode = this.props.params.code;
            comment.photo = globalInfo.user.userExt.photo;
            comment.commer = Util.getUserId();
            commentList.unshift(comment);
            ++postData.sumComment;
            this.setState({commentList, postData});
        }
    }
    // 页面刷新获取帖子详情和（评论或点赞）
    handleRefresh(resolve){
        if(this.state.activeNavIndex == 0){
            Promise.all([
                this.getPostDetail(true),
                this.getPageComment(true)
            ]).then(resolve).catch(resolve);
        }else{
            Promise.all([
                this.getPostDetail(true),
                this.getPageLike(true)
            ]).then(resolve).catch(resolve);
        }
    }
    // 页面上拉加载更多评论或点赞
    handleLoadMore(resolve){
        let {activeNavIndex, hasMore0, hasMore1} = this.state;
        if(activeNavIndex == "0"){
            this.getPageComment().then(resolve);
        }else if(activeNavIndex == "1"){
            this.getPageLike().then(resolve);
        }
    }
    // 处理点赞回调事件
    handleDZ(){
        let {postData, likeList} = this.state;
        if(postData.isDZ == "0"){
            postData.isDZ = "1";
            postData.sumLike++;
            if(likeList){
                likeList.unshift({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname,
                    "photo": globalInfo.user.userExt.photo
                });
            }
        }else{
            postData.isDZ = "0";
            postData.sumLike--;
            if(likeList){
                likeList.splice(Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker"), 1);
                if(!likeList.length)
                    likeList = null;
            }
        }
        this.setState({postData, likeList});
    }
    // 处理收藏回调事件
    handleSC(){
        let {postData} = this.state;
        postData.isSC = postData.isSC == "0" ? "1" : "0";
        this.setState({postData});
    }
    // 处理评论列表点击事件，即回复该条评论、举报、或删除评论
    handleCommentItemClick(item){
        let userId = localStorage["userId"];
        let isMine = item.commer == userId;
        let BUTTONS;
        if(isMine){
            BUTTONS = ['删除'];
        }else{
            BUTTONS = ['回复', '举报'];
        }
        BUTTONS.push('取消');
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            message: '操作',
            maskClosable: true,
            'data-seed': 'logId',
        }, (buttonIndex) => {
            if(isMine && buttonIndex == 0 || !isMine && buttonIndex != 2){
                if(!Util.isLogin()){
                    Util.goLogin();
                    return;
                }
            }
            this.commentActionSheetClick(buttonIndex, item, isMine);
        });
    }
    // 处理handleCommentItemClick的操作
    commentActionSheetClick(index, item, isMine){
        if(isMine && index == 0){ //删除评论
            Modal.alert('删除', '确定删除评论吗?', [
                { text: '取消', onPress: () => {} },
                { text: '确定', onPress: () => this.deleteComment(item) },
            ]);

        }else if(!isMine && index != 2){
            if(index == 0){     // 回复评论
                this.setState({
                    showComment: 1,
                    isPostComment: 0,
                    replayNickname: item.nickname,
                    commentParentCode: item.code,
                    replayCommer: item.commer
                });
            }else{              // 举报
                Modal.prompt('举报评论', '举报理由', [
                    { text: '取消' },
                    { text: '举报', onPress: value => this.reportComment(value, item.code) },
                ], 'plain-text');
            }
        }
    }
    // 删除评论
    deleteComment(item){
        PostCtr.deleteComment([item.code])
            .then((data) => {
                Toast.success("删除成功", 1);
                let {commentList, postData} = this.state;
                let idx = Util.findItemInArr(commentList, item, "code");
                if(idx != -1){
                    commentList.splice(idx, 1);
                    --postData.sumComment;
                    this.setState({commentList, postData});
                }
            });
    }
    // 举报评论
    reportComment(reportNote, code){
        if(Util.isEmptyString(reportNote)){
            Toast.info("举报理由不能为空", 1);
            return;
        }
        Util.showLoading("举报中...");
        PostCtr.reportComment(code, reportNote)
            .then((data) => {
                Toast.success("举报成功", 1);
            }).catch(() => {});
    }
    // 点击底部的评论输入框，弹出评论组件
    handleCommentInputClick(e){
        this.setState({
            showComment: 1,
            isPostComment: 1,
            commentParentCode: this.props.params.code
        });
    }
    // 隐藏弹出的评论组件
    hideComment(){
        this.setState({
            showComment: 0
        });
    }
    // 关注用户
    followUser(){
        Util.showLoading("关注中...");
        UserCtr.followUser(this.state.postData.publisher)
            .then(() => {
                Util.hideLoading();
                this.setState({isFollow: 1});
            }).catch(() => {});
    }
    // 取消关注
    unFollowUser(){
        Util.showLoading("取消关注中...");
        UserCtr.unFollowUser(this.state.postData.publisher)
            .then(() => {
                Util.hideLoading();
                this.setState({isFollow: 0});
            }).catch(() => {});
    }

    render() {
        let {
            activeNavIndex,     //  当前激活对tab
            postData,           //  帖子信息
            initializing,       //  Tloader的初始化状态
            hasMore,            //  是否有更多数据
            commentParentCode,  //  评论的父类code
            isPostComment,      //  是否是针对帖子的评论
            showComment,        //  是否显示评论框
            isFollow,           //  是否关注
            commentList,        //  评论列表
            likeList,           //  点赞列表
            praiseData,         //  打赏列表
            totalPraise,        //  打赏总人数
            replayNickname,     //  如果是回复评论，则这个值为回复的那个评论的nickname
            replayCommer,       //  如果是回复评论，则这个值为回复的那个评论的userId
        } = this.state;
        let userId = localStorage["userId"] || "";
        let isMine = postData && postData.publisher == userId || false;
        let isDZ = "0", isSC = "0", sumComment = 0, sumLike = 0;
        if(postData){
            sumComment = postData.sumComment;
            sumLike = postData.sumLike;
            isDZ = postData.isDZ;
            isSC = postData.isSC;
        }
        return (
            <div class="box">
                <NormalHeader title="帖子详情"/>
                <Tloader
                    initializing={initializing}
                    onRefresh={this.handleRefresh.bind(this)}
                    hasMore={hasMore}
                    onLoadMore={this.handleLoadMore.bind(this)}
                    autoLoadMore={true}
                    className="tloader headline">
                    {postData ? <PostDetailHeader
                                    isFollow={isFollow}
                                    followUser={this.followUser.bind(this)}
                                    unFollowUser={this.unFollowUser.bind(this)}
                                    pData={postData}
                                    showCarousel={this.props.showCarousel}
                                /> : ""}
                    {
                        postData && postData.status == "E" && postData.approveNote
                        ? <div class="wp100">
                            <WhiteSpace size="sm" />
                            <div class="post-approve-note">{postData.approveNote}</div>
                        </div>
                        : ""
                    }
                    <WhiteSpace size="sm" />
                    <PostPriceButton handlePraiseCallback={this.handlePraiseCallback.bind(this)} postCode={this.props.params.code} />
                    <WhiteSpace size="sm" />
                    <PostPriceUserList praiseData={praiseData} totalPraise={totalPraise} postCode={this.props.params.code}/>
                    <WhiteSpace size="sm" />
                    {commentList
                        ? <CommentAndDZ
                            handleChange={this.handleChange.bind(this)}
                            activeNavIndex={activeNavIndex}
                            commentList={commentList}
                            likeList={likeList}
                            sumComment={sumComment}
                            sumLike={sumLike}
                            handleCommentItemClick={this.handleCommentItemClick.bind(this)}/> : ""}
                </Tloader>
                <CommentBottom
                    handleDZ={this.handleDZ.bind(this)}
                    isMine={isMine}
                    handleSC={this.handleSC.bind(this)}
                    code={this.props.params.code}
                    isDZ={isDZ}
                    isSC={isSC}
                    handleCommentInputClick={this.handleCommentInputClick.bind(this)} />
                {
                    showComment
                        ? <CommentWindow
                            code={commentParentCode}
                            isPostComment={isPostComment}
                            replayNickname={replayNickname}
                            replayCommer={replayCommer}
                            handleCancel={this.hideComment.bind(this)}
                            handleOk={this.addComment.bind(this)} /> : ""
                }
            </div>
        )
    }
}
