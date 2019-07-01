import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../components/NormalHeader';
import NormalPostItem from '../../../components/NormalPostItem';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {Badge, Flex} from 'antd-mobile';
import './index.scss';

const Util = require('../../../util/util');
const IMUtil = require('../../IMChat/IMUtil');
const rightIcon = require('../../../../images/_pic.png');
const msgIcon = require('../../../../images/消息列表－系统消息@2x.png');
const peopleIcon = require('../../../../images/人@2x.png');

export default class Message extends Component {
    componentDidMount(){
        GeneralCtr.recordPageView();
        // GeneralCtr.getUnReadSmsCount()
        //     .then((data) => {
        //         alert(JSON.stringify(data));
        //     });
    }

    handleIconClick(){
        Util.goPath('/user/attention/list')
    }

    goBack(){
        Util.goPath('/user');
    }

    // 生成最近联系人
    getChatList(){
        let {chatRoomData} = this.props;
        let chatData = chatRoomData[Util.getUserId()];
        chatData = chatData && chatData.msg || {};
        var result = [], key = 0, flag = false;
        for(let chatUserId in chatData){
            if(chatData[chatUserId].msg && chatData[chatUserId].msg.length){
                let item = chatData[chatUserId];
                if(!item.photo){
                    for(let i = item.msg.length; i;){
                        if(item.msg[--i].from == chatUserId){
                            flag = true;
                            item.photo = Util.formatListThumbanailAvatar(item.msg[i].ext.photo);
                            break;
                        }
                    }
                }
                if(item.noReadCount != 0){
                    result.push(
                        <li key={`index${key++}`}>
                            <Link class="link_block" to={`/user/chatRoom/${chatUserId}`}>
                                <Flex>
                                    <img src={item.photo} alt=""/>
                                    <span class="contract-item-cont" dangerouslySetInnerHTML={{__html: IMUtil.parseEmojiContent(item.msg[item.msg.length - 1].value, item.msg[item.msg.length - 1].type)}}></span>
                                    <Badge text={item.noReadCount} style={{backgroundColor: '#d23e3e'}} />
                                </Flex>
                            </Link>
                        </li>
                    )
                }else{
                    result.push(
                        <li key={`index${key++}`}>
                            <Link class="link_block" to={`/user/chatRoom/${chatUserId}`}>
                                <Flex>
                                    <img src={item.photo} alt=""/>
                                    <span class="contract-item-cont" dangerouslySetInnerHTML={{__html: IMUtil.parseEmojiContent(item.msg[item.msg.length - 1].value, item.msg[item.msg.length - 1].type)}}></span>
                                </Flex>
                            </Link>
                        </li>
                    )
                }
            }
        }
        // 更新聊天数据
        flag && this.props.updateChatInfo(chatRoomData);
        return result;
    }

    render(){
        let chatList = this.getChatList();
        return (
            <div class="box">
                <NormalHeader title="我的消息" rightIcon={peopleIcon} goBack={this.goBack.bind(this)} handleClick={this.handleIconClick.bind(this)}/>
                <div class="myMsg">
                    <ul>
                        <li><Link to='/user/like/list'><div class="best"></div><span>赞</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link to='/user/mention/list/1'><div class="mention"></div><span>提到我的</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link to='/user/comment/list/1'><div class="comment"></div><span>评论</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link to='/user/sysMessage'><div class="systemMsg"></div><span>系统消息</span><img src={rightIcon} alt=""/></Link></li>
                    </ul>
                </div>
                {
                    chatList.length
                        ? (
                            <div class="contacts im-list-content im-mes-list-content">
                                <p><span>最近联系人</span></p>
                                <ul>{chatList}</ul>
                            </div>
                        ) : ""
                }
            </div>
        );
    }
}
