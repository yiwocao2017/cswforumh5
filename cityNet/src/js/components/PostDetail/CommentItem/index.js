import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');
const postEmojiUtil = require('../../../util/postEmoji');

export default class CommentItem extends Component {
    // 处理评论内容点击事件，判断如果点击@用户 时，跳转到用户中心
    handleCommentItemClick(e){
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
            this.props.handleCommentItemClick(this.props.itemData);
        }
    }
    // 点击用户昵称进入用户主页
    goUserCenter(commer, e){
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/user/'+commer);
    }
    render(){
        let {code, itemData} = this.props;
        let {content, nickname, commer, photo} = itemData;


        return (
            <div class="post-comment-item" onClick={this.handleCommentItemClick.bind(this)}>
                <img onClick={this.goUserCenter.bind(this, commer)} src={Util.formatListThumbanailAvatar(photo)} class="post-comment-item-img"/>
                <span class="post-comment-item-title" onClick={this.goUserCenter.bind(this, commer)}>{nickname}</span>
                {
                    itemData.parentCode != itemData.postCode
                    ? <span class="post-comment-item-title" onClick={this.goUserCenter.bind(this, itemData.parentComment.commer)}>
                        <span class="t_999 plr1">回复</span>
                        <span class="goUserCenterSpan">@{itemData.parentComment.nickname}</span>
                    </span>
                    : ""
                }
                <span class="post-comment-item-title">：</span>
                <span class="post-comment-item-cont">{postEmojiUtil.parseEmojiContent(content)}</span>
            </div>
        );
    }
}
