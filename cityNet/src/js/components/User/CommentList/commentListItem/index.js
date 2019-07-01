import React, {Component} from 'react';
import {Link} from 'react-router';
import {Flex} from 'antd-mobile';
import {globalInfo} from '../../../../containers/App';
import './index.scss';

const Item = Flex.Item;
const Util = require('../../../../util/util');
const postEmojiUtil = require('../../../../util/postEmoji');

export default class CommentListItem extends Component {
    getSendHtml(postData){
        return (
            <Flex key="1" className="b_e6_b comment-list-item" align="top">
                <div class="w50 c-list-img-wrap">
                    <Link to={`/user/${globalInfo.user.userId}`}>
                        <img src={Util.formatListThumbanailAvatar(globalInfo.user.userExt.photo)}/>
                    </Link>
                </div>
                <div class="pl10 flex1 pt5">
                    <div class="wp100">
                        <div class="fs17 lh110">{globalInfo.user.nickname}</div>
                        <div class="fs13 t_b4 pt5">
                            {Util.formatDate(postData.commDatetime)}
                            {postData.status == "F" ? <span class="post-content-filter">被过滤</span> : ""}
                        </div>
                    </div>
                    <div class=" bg_f5 p10 mt10 t_999" style={{"borderRadius": "4px"}}>
                        <Link to={`/post/${postData.postCode}`} class="wp100 inline_block over-hide break_all">
                            {
                                postData.parentComment
                                ?   <div>
                                        <div class="wp100 fs14 lh110 t_999">@{postData.parentComment.nickname}</div>
                                        <div class="wp100 fs13 lh150 t_999">
                                            {postEmojiUtil.parseEmojiContent(postData.parentComment.content)}
                                        </div>
                                    </div>
                                :   <div>
                                        <div class="wp100 fs14 lh110 t_999">@{postData.post.nickname}</div>
                                        <div class="wp100 fs13 lh150 t_999">
                                            {postEmojiUtil.parseEmojiContent(postData.post.content.substr(0, 100))}
                                            {postData.post.content.length > 100 ? "..." : ""}
                                        </div>
                                    </div>
                            }
                        </Link>
                    </div>
                    <div class="wp100 mt10">
                        <div class="wp100 fs15 lh150">{postEmojiUtil.parseEmojiContent(postData.content)}</div>
                    </div>
                </div>
            </Flex>
        )
    }
    getReceivedHtml(postData){
        return (
            <Flex key="2" className="b_e6_b comment-list-item" align="top">
                <div class="w50 c-list-img-wrap">
                    <Link to={`/user/${postData.commer}`}>
                        <img src={Util.formatListThumbanailAvatar(postData.photo)}/>
                    </Link>
                </div>
                <div class="pl10 flex1 pt5">
                    <div class="wp100">
                        <div class="fs17 lh110">{postData.nickname}</div>
                        <div class="fs13 t_b4 pt5">
                            {Util.formatDate(postData.commDatetime)}
                            {postData.status == "F" ? <span class="post-content-filter">被过滤</span> : ""}
                        </div>
                    </div>
                    <div class=" bg_f5 p10 mt10 t_999" style={{"borderRadius": "4px"}}>
                        <Link to={`/post/${postData.postCode}`} class="wp100 inline_block over-hide break_all">
                            <div class="wp100 fs14 lh110 t_999">@{globalInfo.user.nickname}</div>
                            {
                                postData.parentComment
                                    ? <div class="wp100 fs13 lh150 t_999">
                                        {postEmojiUtil.parseEmojiContent(postData.parentComment.content.substr(0, 100))}
                                    </div>
                                    : <div class="wp100 fs13 lh150 t_999">
                                        {postEmojiUtil.parseEmojiContent(postData.post.content.substr(0, 100))}
                                        {postData.post.content.length > 100 ? "..." : ""}
                                    </div>
                            }

                        </Link>
                    </div>
                    <div class="wp100 mt10">
                        <div class="wp100 fs15 lh150">{postEmojiUtil.parseEmojiContent(postData.content)}</div>
                    </div>
                </div>
            </Flex>
        )
    }
    render(){
        let {postData, type} = this.props;
        let item = type == 1 ? this.getSendHtml(postData) : this.getReceivedHtml(postData);
        return item;
    }
}
