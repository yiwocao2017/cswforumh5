import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Modal, Toast, Flex} from 'antd-mobile';
import ShowPic from '../ShowPic';
import className from 'classnames';
import {PostCtr} from '../../controller/PostCtr';
import {UserCtr} from '../../controller/UserCtr';
import './index.scss';

const Util = require("../../util/util");
const postEmojiUtil = require('../../util/postEmoji');

const commentIcon = require('../../../images/评论－无边框@2x.png');
const likeIcon = require('../../../images/点赞无边框@2x.png');
const redLikeIcon = require('../../../images/点赞红色－无边框@2x.png');
const jhIcon = require('../../../images/jing.png');

export default class NormalPostItem extends Component {
    // 点击图片后弹出carousel显示图片
    handleImgClick(index, e){
        e.preventDefault();
        e.stopPropagation();
        this.props.showCarousel(this.props.pData.picArr, index);
    }
    // 置顶
    setTop(location, e){
        e.preventDefault();
        e.stopPropagation();
        if(/A/.test(location)){
            if(location.length == 1){
                location = "D";
            }else{
                location = location.replace(/(,A)|(A,)/, "");
            }
        }else{
            if(location == "D"){
                location = "A"
            }else{
                location += ",A";
            }
        }
        this.setJHOrTop(location);
    }
    // 设置精华、取消精华
    setJH(location, e){
        e.preventDefault();
        e.stopPropagation();
        if(/B/.test(location)){
            if(location.length == 1){
                location = "D";
            }else{
                location = location.replace(/(,A)|(A,)/, "");
            }
        }else{
            if(location == "D"){
                location = "B"
            }else{
                location += ",B";
            }
        }
        this.setJHOrTop(location);
    }
    // 设置精华或头条
    setJHOrTop(location){
        Util.showLoading("设置中...");
        PostCtr.setJHOrTop(this.props.pData.code, location)
            .then(() => {
                Toast.success("设置成功", 1);
                this.props.setJHOrTop(this.props.pData, location);
            }).catch(()=>{});
    }
    /*
     * 删除帖子
     */
    deletePost(e){
        e.preventDefault();
        e.stopPropagation();
        let me = this;
        Modal.alert('删除帖子', '确定删除帖子吗?', [
            { text: '取消', onPress: () => {} },
            { text: '确定', onPress: () => {
                Util.showLoading("删除中...");
                PostCtr.deletePost([me.props.pData.code])
                    .then((data) => {
                        Toast.success("删除成功", 1);
                        let {deletePost} = me.props;
                        deletePost && deletePost(me.props.pData);
                    }).catch(() => {});
            }}
        ]);
    }
    // 审查通过
    passPost(e){
        e.preventDefault();
        e.stopPropagation();
        let me = this;
        Modal.prompt('审查通过', '审查说明', [
            { text: '取消' },
            { text: '确认', onPress: approveNote => {
                if(!Util.isEmptyString(approveNote)){
                    Util.showLoading("审核中...");
                    PostCtr.passPost([this.props.pData.code], approveNote)
                        .then((data) => {
                            Util.hideLoading();
                            this.props.passPost && this.props.passPost(this.props.pData);
                        }).catch(() => {});
                } else
                    Toast.info("审查说明不能为空", 1);
            } },
        ], 'plain-text');
    }
    // 审查不通过
    unPassPost(e){
        e.preventDefault();
        e.stopPropagation();
        let me = this;
        Modal.prompt('审查不通过', '审查说明', [
            { text: '取消' },
            { text: '确认', onPress: approveNote => {
                if(!Util.isEmptyString(approveNote)){
                    Util.showLoading("审核中...");
                    PostCtr.unPassPost([this.props.pData.code], approveNote)
                        .then((data) => {
                            Util.hideLoading();
                            this.props.deletePost && this.props.deletePost(this.props.pData);
                        }).catch(() => {});
                }
                else
                    Toast.info("审查说明不能为空", 1)
            } },
        ], 'plain-text');
    }
    // 进入用户中心
    handleNicknameClick(userId, e){
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/user/' + userId);
    }
    // 点赞
    handleLikeClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        let {pData} = this.props;
        Util.showLoading("点赞中...");
        PostCtr.likePost(pData.code)
            .then(() => {
                Util.hideLoading();
                this.props.handleLikeClick(pData);
            }).catch(Util.hideLoading);
    }
    // 处理帖子内容点击事件，判断如果点击@用户 时，跳转到用户中心
    handleContentClick(e){
        e.stopPropagation();
        e.preventDefault();
        let target = e.target;
        // 如果点击的是@用户 这个区域，则根据当前区域的nickname去获取userId，然后跳转到用户中心
        if(/^goUserCenterSpan$/.test(target.className)){
            Util.showLoading()
            // 根据昵称获取用户的userId
            UserCtr.getUserByNickname(target.innerText.substr(1))
                .then((data) => {
                    Util.hideLoading();
                    if(data.list.length)
                        Util.goPath(`/user/${data.list[0].userId}`);
                    else
                        Toast.fail("非常抱歉，未找到该用户", 1);
                }).catch(() => {});
        }else{
            Util.goPath(this.linkUrl);
        }
    }
    // 图片onload
    handleOnLoad(e){
        let {width, height} = e.target;
        if(width < height){
            e.target.className = "wp100";
        }else{
            e.target.className = "hp100";
        }
    }
    render() {
        let postData = this.props.pData || {};
        let {
            photo,              //  用户头像
            nickname,           //  用户昵称
            publishDatetime,    //  帖子发布时间
            publisher,          //  帖子发布者
            plateName,          //  帖子所属板块
            title,              //  帖子标题
            content,            //  帖子详情
            picArr,             //  图片列表
            sumComment,         //  评论总数
            sumLike,            //  点赞总数
            likeList,           //  点赞列表
            commentList,        //  评论列表
            code,               //  帖子编号
            location,           //  是否精华贴   A置顶 B 精华 C 头条
            isDZ,               //  是否点赞
            status,             //  帖子状态
        } = postData;
        commentList = commentList && commentList.length ? commentList.slice(0, 5) : [];
        let {
            showComment,        //  是否显示评论列表
            hideLikeIcon,       //  是否隐藏评论、点赞按钮
            showManageBtn,      //  是否显示板块管理-->管理的操作
            showCheckBtn,       //  是否显示板块管理-->审查的操作
            toUrl,
        } = this.props;

        let commentListDOM = showComment
            ? (
                <div class="commontDetail">
                    {
                        likeList && likeList.length
                        ? <div class="clickBest">
                            <div>
                                <img src={likeIcon} alt=""/>
                                <span class="comment-total-like">{sumLike || 0}</span>
                                <span class="names">
                                    {likeList.map((like, index) => (
                                        <span onClick={this.handleNicknameClick.bind(this, like.talker)} key={`index${index}`}>{like.nickname}</span>
                                    ))}
                                </span>
                            </div>
                        </div>
                        : ""
                    }
                    {
                        commentList && commentList.length
                        ? <div class="comment-list">
                            {commentList.map((comment, index) => (
                                <Flex key={`comment${index}`} align="top">
                                    <span class="name" onClick={this.handleNicknameClick.bind(this, comment.commer)}>{comment.nickname}：</span>
                                    <span class="comment-item-cont" onClick={this.handleContentClick.bind(this)}>{postEmojiUtil.parseEmojiContent(comment.content)}</span>
                                </Flex>
                            ))}
                            {commentList.length >= 5
                                ? <div class="watchAll">查看全部评论回复>></div> : ""}
                        </div>
                        : ""
                    }
                </div>
            )
            : "";
        toUrl = toUrl ? toUrl + `/${code}` : `/post/${code}`;
        this.linkUrl = toUrl;
        return (
            <li>
                <Link to={toUrl}>
                    <div class="rich-listPic" onClick={this.handleNicknameClick.bind(this, publisher)}><img src={Util.formatListThumbanailAvatar(photo)} alt=""/></div>
                    <div class="rich-wrap">
                        <p class="rich-listTopic t-3dot">{nickname}</p>
                        <p class="rich-listData">{Util.formatDate(publishDatetime)}</p>
                        <div class="rich-listFrom">
                            <span class="rich-come-title">来自</span>&nbsp;<span class="rich-come-cont">{plateName}</span>
                            <br/><br/>
                            {
                                status == "F"
                                    ? <span class="rich-come-cont">被过滤</span>
                                    : status == "C1"
                                        ? <span class="rich-come-cont">不信任待审批</span>
                                        : status == "C2"
                                            ? <span class="rich-come-cont">被举报待审批</span>
                                            : status == "E"
                                                ? <span class="rich-come-cont">审批不通过</span>
                                                : ""
                            }
                        </div>
                    </div>
                    <div class="rich-list-content">
                        <p class="rich-list-title">{/B/.test(location) ? <img src={jhIcon}/> : ""}{title}</p>
                        <p onClick={this.handleContentClick.bind(this)}>{postEmojiUtil.parseEmojiContent(content.substr(0, 100))}</p>
                        {content.length > 100
                            ? <span class="watchAll">查看全文</span>
                            : ""}
                        <Flex class="rich-list-img" justify="start" wrap="wrap">
                            {picArr && picArr.map((img, index) => (
                                <div class={
                                    className({
                                        "rich-list-img-item": true,
                                        "mlr01rem": index % 3 == 1
                                    })
                                } key={`pic${index}`}>
                                    <img
                                        onLoad={this.handleOnLoad.bind(this)}
                                        onClick={this.handleImgClick.bind(this, index)}
                                        src={Util.formatThumbanailImg(img)} />
                                </div>
                            ))}
                        </Flex>
                        {showManageBtn
                            ?
                            <div class="post-manage-btns">
                                <Button onClick={this.setTop.bind(this, location)} type="ghost" size="small" inline>
                                    { /A/.test(location) ? "取消置顶" : "置顶" }
                                </Button>
                                <Button onClick={this.setJH.bind(this, location)} type="ghost" size="small" inline>
                                    { /B/.test(location) ? "取消精华" : "精华" }
                                </Button>
                                <Button onClick={this.deletePost.bind(this)} type="ghost" size="small" inline>删除</Button>
                            </div>
                            : ""
                        }
                        {showCheckBtn
                            ?
                            <div class="post-manage-btns">
                                <Button onClick={this.unPassPost.bind(this)} type="ghost" size="small" inline>违规</Button>
                                <Button onClick={this.passPost.bind(this)} type="ghost" size="small" inline>不违规</Button>
                                <Button onClick={this.deletePost.bind(this)} type="ghost" size="small" inline>删除</Button>
                            </div>
                            : ""
                        }
                        {hideLikeIcon ? ""
                            : <div class="ionPic">
                                <div>
                                    <img src={commentIcon} alt=""/>
                                    <span>{sumComment || 0}</span>
                                </div>
                                <div onClick={this.handleLikeClick.bind(this)}>
                                    <img src={isDZ == "1" ? redLikeIcon : likeIcon} alt=""/>
                                    <span>{sumLike || 0}</span>
                                </div>
                            </div>
                        }
                        {commentListDOM}
                    </div>
                </Link>
            </li>
        );
    }
}
