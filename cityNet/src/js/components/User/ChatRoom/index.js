import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../NormalHeader';
import {Flex, Button, TextareaItem} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import className from 'classnames';
import {createForm} from 'rc-form';
import {globalInfo} from '../../../containers/App';
import IMEmojiGrid from './IMEmojiGrid';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const icon = require('../../../../images/emojiIcon.png');
const IMUtil = require('../../IMChat/IMUtil');
const Util = require('../../../util/util');

class ChatRoom extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            initializing: 1,
            refreshedAt: Date.now(),
            toUser: {},               //当前聊天用户的信息（toUser）
            showEmoji: false,       //是否显示表情列表
            content: ""             //输入框内容
        }
    }
    componentDidMount() {
        this.setState({initializing: 2});
        this.getUserInfo();
        GeneralCtr.recordPageView();
    }
    componentDidUpdate(){
        this.chatRef && this.chatRef.scrollIntoView && this.chatRef.scrollIntoView();
    }
    // 获取聊天用户详情
    getUserInfo(){
        UserCtr.getUserInfoByUserId(this.props.params.userId)
            .then((data) => {
                this.setState({toUser: data});
                this.clearNoReadCount(data);
            }).catch(() => {
                this.clearNoReadCount();
            });
    }
    // 清除和当前聊天者的未读消息数,并更新消息里面的用户的nickname和photo
    clearNoReadCount(toUserInfo){
        let {chatRoomData} = this.props,
            userId = Util.getUserId(),
            toUserId = this.props.params.userId;
        chatRoomData[userId] = chatRoomData[userId] || {};
        chatRoomData[userId].msg = chatRoomData[userId].msg || {};
        chatRoomData[userId].msg[toUserId] = chatRoomData[userId].msg[toUserId] || {
            noReadCount: 0,
            msg: []
        };

        let totalNoReadCount = chatRoomData[userId].noReadCount || 0,
            currentNoReadCount = chatRoomData[userId].msg[toUserId].noReadCount || 0;
        // 把总未读消息数减去当前未读消息
        chatRoomData[userId].noReadCount = totalNoReadCount - currentNoReadCount;
        // 清除和当前聊天者的未读消息数
        chatRoomData[userId].msg[toUserId].noReadCount = 0;
        // 更新消息记录里的用户头像和昵称
        let toUserChat = chatRoomData[userId].msg[toUserId];
        toUserChat.photo = Util.formatListThumbanailAvatar(toUserInfo.userExt.photo);
        let msg = toUserChat.msg;
        msg = msg.map((item, index) => {
            if(!item.sendByMe && toUserInfo){
                item.ext = {
                    nickname: toUserInfo.nickname,
                    photo: Util.formatListThumbanailAvatar(toUserInfo.userExt.photo)
                };
            }else{
                item.ext = {
                    nickname: globalInfo.user.nickname,
                    photo: Util.formatListThumbanailAvatar(globalInfo.user.userExt.photo)
                };
            }
            return item;
        });
        chatRoomData[userId].msg[toUserId].msg = msg;
        // 更新聊天数据
        this.props.updateChatInfo(chatRoomData);
    }
    // 发送消息
    sendMsg(e){
        e.stopPropagation();
        e.preventDefault();
        const {getFieldValue, setFieldsValue} = this.props.form;
        let content = getFieldValue("content");
        if(!Util.isEmptyString(content)){
            let {toUser} = this.state;
            this.props.sendTextMsg(content, toUser.userId, globalInfo.user.nickname, Util.formatListThumbanailAvatar(globalInfo.user.userExt.photo));
            setFieldsValue({
                "content": ""
            });
            this.setState({showEmoji: false});
        }
    }
    // 获取聊天数据
    getChatList(){
        let {chatRoomData} = this.props;
        let chatData = chatRoomData[Util.getUserId()] || {};
        let mid = chatData["msg"] || {};
        let mid1 = mid[this.props.params.userId] || {};
        chatData = mid1.msg || [];
        return chatData;
    }
    /*
     * 处理输入框获取焦点事件,并隐藏表情
     */
    handleTextFocus() {
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("content");
        setTimeout(() => {
            _context.refs.textarea.scrollIntoView();
        }, 1);
        this.setState({showEmoji: false});
    }
    /*
     * 处理textarea失去焦点事件,并保存最后一次的焦点位置
     */
    handleTextBlur(){
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("content");
        this.savePos(_context.refs.textarea);
    }
    /*
     * 点击表情图标，弹出表情轮播图
     */
    handleEmojiIconClick(e) {
        e.preventDefault();
        e.stopPropagation();
        let {showEmoji} = this.state;
        this.setState({
            showEmoji: !showEmoji
        });
    }
    /*
     * 处理轮播图里的表情点击事件,并把表情加入textarea中
     * @param el    点击的表情
     * @param index 点击的表情在数组中的下标
     */
    handleEmojiClick(el, index) {
        this.setTextAreaValue(el.text);
    }
    /*
     * 在最后一次保存的textarea的光标处加入文本内容
     * @param text    文本内容
     */
    setTextAreaValue(text){
        const {setFieldsValue, getFieldValue} = this.props.form;
        let content = getFieldValue("content") || "";
        let {start, end} = this.state;
        let prev = content.substr(0, start),
            suffix = content.substr(end);
        setFieldsValue({
            "content": prev + text + suffix
        });
        if(start != end){
            end = start;
        }
        this.setState({
            start: start + text.length,
            end: end + text.length
        });
    }
    /*
     * 获取并保存textarea光标的位置
     * @param textBox    点击的表情
     */
    savePos(textBox) {
        let config = Util.savePos(textBox);
        this.setState({
            start: config.start,
            end: config.end
        });
    }
    // 点击头像进入用户中心
    goUserCenter(data, e){
        e.stopPropagation();
        e.preventDefault();
        Util.goPath(`/user/${data.from}`);
    }

    render(){
        let {initializing, refreshedAt, content, showEmoji} = this.state;
        let chatRoomData = this.getChatList();
        const {getFieldProps, getFieldValue} = this.props.form;
        return (
            <div class="chat-room-wrap box">
                <NormalHeader title='聊天室'/>
                <div class="chatView flex-column flex_1 im-list-content">
                    <Tloader initializing={initializing} hasMore={false} className="tloader headline easemobWidgetWrapper-mobile">
                        {
                            chatRoomData.length
                            ? chatRoomData.map((data, index) => {
                                let option = {
                                    key: data.key || `${index}`,
                                }
                                if(index == chatRoomData.length - 1){
                                    option.ref = (chatRef) => {this.chatRef = chatRef}
                                }
                                return (
                                    <div class="clearfix" {...option}>
                                        <div class="emim-clear emim-mt20 emim-tl emim-msg-wrapper emim-fr">
                                            <div class={className({
                                                "easemobWidget-right": data.sendByMe,
                                                "easemobWidget-left": !data.sendByMe
                                            })}>
                                                <div class="easemobWidget-msg-wrapper">
                                                    <i class="easemobWidget-corner"></i>
                                                    <img class="mw30p"
                                                        onClick={this.goUserCenter.bind(this, data)}
                                                        src={data.ext.photo}/>
                                                    <div class="easemobWidget-msg-container">
                                                        <div dangerouslySetInnerHTML={{__html: IMUtil.parseEmojiContent(data.value, data.type)}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : ""
                        }
                    </Tloader>
                </div>
                {showEmoji
                    ? <IMEmojiGrid handleEmojiClick={this.handleEmojiClick.bind(this)}/>
                    : ""}
                <div class="chat-room-bottom">
                    <Flex justify="center">
                        <Flex.Item>
                            <TextareaItem
                                {...getFieldProps('content')}
                                autoHeight
                                placeholder="请输入信息"
                                onFocus={this.handleTextFocus.bind(this)}
                                onBlur={this.handleTextBlur.bind(this)}
                            />
                        </Flex.Item>
                        <img onClick={this.handleEmojiIconClick.bind(this)} class="emj-icon" src={icon}/>
                        <input class="send-btn" onClick={this.sendMsg.bind(this)} type="button" value="发送" disabled={Util.isUndefined(getFieldValue("content"))}/>
                    </Flex>
                </div>
            </div>
        );
    }
}
export default createForm()(ChatRoom);
