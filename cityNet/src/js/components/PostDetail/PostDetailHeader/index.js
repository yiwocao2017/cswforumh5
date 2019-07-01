import React, {Component} from 'react';
import {Card, Button, ActionSheet, Toast, Flex} from 'antd-mobile';
import ShowPic from '../../ShowPic';
import className from 'classnames';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');
const postEmojiUtil = require('../../../util/postEmoji');
const commentIcon = require('../../../../images/评论－无边框@2x.png');
const likeIcon = require('../../../../images/点赞无边框@2x.png');
const readIcon = require('../../../../images/浏览@2x.png');
const jhIcon = require('../../../../images/jing.png');

export default class PostDetailHeader extends Component {
    // 关注、取消关注
    handleClick(toUser, e) {
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        let {isFollow, followUser, unFollowUser} = this.props;
        if(isFollow)
            unFollowUser();
        else
            followUser();
    }
    //  点击头像进入用户中心
    goUserCenter(publisher, e){
        e.preventDefault();
        e.stopPropagation();
        Util.goPath("/user/" + publisher);
    }
    // 点击图片后弹出carousel显示图片
    handleImgClick(index, e){
        e.preventDefault();
        e.stopPropagation();
        this.props.showCarousel(this.props.pData.picArr, index);
    }
    // 隐藏弹出的carousel
    hideCarousel(e){
        e.preventDefault();
        this.setState({
            showCarousel: 0
        });
    }
    // 处理帖子内容点击事件，判断如果点击@用户 时，跳转到用户中心
    handleContentClick(e){
        e.preventDefault();
        e.stopPropagation();
        let target = e.target;
        // 如果点击的是@用户 这个区域，则根据当前区域的nickname去获取userId，然后跳转到用户中心
        if(/^goUserCenterSpan$/.test(target.className)){
            Util.showLoading();
            // 根据昵称获取用户的userId
            UserCtr.getUserByNickname(target.innerText.substr(1))
                .then((data) => {
                    Util.hideLoading();
                    if(data.list.length)
                        Util.goPath(`/user/${data.list[0].userId}`);
                    else
                        Toast.fail("非常抱歉，未找到该用户", 1);
                }).catch(() => {});
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
        let {
            picArr,             //  帖子图片
            photo,              //  发帖人头像
            nickname,           //  发帖人昵称
            publisher,          //  发帖人userId
            publishDatetime,    //  发帖时间
            title,              //  帖子标题
            content,            //  帖子内容
            isDZ,               //  是否点赞
            isSC,               //  是否收藏
            sumComment,         //  评论总数
            sumLike,            //  点赞总数
            sumRead,            //  阅读总数
            location,           //  帖子位置（A置顶、B精华、C头条）
            status,             //  帖子状态
        } = this.props.pData;
        let {isFollow} = this.props;
        let userId = Util.getUserId();
        let isMine = userId && userId == publisher || false;
        return (
            <div>
                <Card className="post-card" full>
                    <Card.Header
                        onClick={this.goUserCenter.bind(this, publisher)}
                        title={nickname}
                        thumb={Util.formatListThumbanailAvatar(photo)}
                        extra={
                            isMine ? ""
                                : <Button className = "small-btn" inline onClick = {
                                    this.handleClick.bind(this, publisher)
                                }>{isFollow ? "取消关注" : "+ 关注"}</Button>
                        } />
                    <Card.Body className="normal-post-body">
                        <div class="normal-post-top" onClick={this.handleContentClick.bind(this)}>
                            <div class="post-body-title">{/B/.test(location) ? <img src={jhIcon}/> : ""}{title}</div>{postEmojiUtil.parseEmojiContent(content)}
                        </div>
                        <Flex class="normal-post-imgs" justify="start" wrap="wrap">
                            {picArr && picArr.map((img, index) => (
                                <div class={
                                    className({
                                        "rich-list-img-item": true,
                                        "mlr015rem": index % 3 == 1
                                    })
                                } key={`pic${index}`}>
                                    <img
                                        onLoad={this.handleOnLoad.bind(this)}
                                        onClick={this.handleImgClick.bind(this, index)}
                                        src={Util.formatThumbanailImg(img)}/>
                                </div>
                            ))}
                        </Flex>
                        <div class="post-body-bottom-date">
                            {Util.formatDate(publishDatetime)}
                            {
                                status == "F"
                                    ? <span class="post-body-bottom-filter">被过滤</span>
                                    : status == "C1"
                                        ? <span class="post-body-bottom-filter">不信任待审批</span>
                                        : status == "C2"
                                            ? <span class="post-body-bottom-filter">被举报待审批</span>
                                            : status == "E"
                                                ? <span class="post-body-bottom-filter">审批不通过</span>
                                                : ""
                            }
                        </div>
                        <div class="post-body-bottom">
                            <div class="post-body-bottom-img-wrap"><img class="post-body-bottom-img post-body-bottom-read-img" src={readIcon}/>{sumRead || 0}</div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
