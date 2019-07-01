import React, {Component} from 'react';
import {Link} from 'react-router';
import {Flex} from 'antd-mobile';
import {globalInfo} from '../../../../containers/App';
import './index.scss';

const Item = Flex.Item;
const Util = require('../../../../util/util');
const postEmojiUtil = require('../../../../util/postEmoji');

export default class LikeListItem extends Component {
    render(){
        let {postData} = this.props;
        return (
            <Flex className="b_e6_b like-list-item" align="top">
                <div class="w50 c-list-img-wrap">
                    <Link to={`/user/${postData.talker}`}>
                        <img src={Util.formatListThumbanailAvatar(postData.photo)}/>
                    </Link>
                </div>
                <div class="pl10 flex1 pt5">
                    <div class="wp100">
                        <div class="fs17 lh110">{postData.nickname}</div>
                        <div class="fs13 t_b4 pt5">{Util.formatDate(postData.talkDatetime)}</div>
                    </div>
                    <div class=" bg_f5 p10 mt10 t_999" style={{"borderRadius": "4px"}}>
                        <Link to={`/post/${postData.postCode}`} class="wp100 inline_block over-hide">
                            <div class="wp100 fs14 lh110 t_999">@{globalInfo.user.nickname}</div>
                            <div class="wp100 fs13 lh150 t_999">
                                {postEmojiUtil.parseEmojiContent(postData.postContent.substr(0, 100))}
                                {postData.postContent.length > 100 ? "..." : ""}
                            </div>
                        </Link>
                    </div>
                    <div class="wp100 mt10">
                        <div class="wp100 fs15 lh150">赞了你的帖子</div>
                    </div>
                </div>
            </Flex>
        );
    }
}
