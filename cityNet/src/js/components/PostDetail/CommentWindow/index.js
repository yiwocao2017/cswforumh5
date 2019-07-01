import React, {Component} from 'react';
import {WhiteSpace, List, TextareaItem, InputItem, Flex, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import EmojiGrid from '../../../containers/WritePost/EmojiGrid';
import AtUserList from '../../../containers/WritePost/AtUserList';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Ajax = require('../../../util/ajax');
const Util = require('../../../util/util');
const Item = Flex.Item;

class CommentWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 0,
            showEmoji: false,
            showUserList: false,
        }
    }
    // 发布评论
    handleSubmit(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields((error, param) => {
            if(!error){
                const {handleOk, isPostComment, code, handleCancel, replayCommer, replayNickname} = this.props;
                param.type = isPostComment ? 1 : 2;
                param.parentCode = code;
                PostCtr.publishComment(param)
                    .then((data) => {
                        if(data.code){
                            handleCancel();
                            let replyParam = {
                                content: param.content,
                                code: data.code,
                                commer: Util.getUserId(),
                                parentCode: code
                            };
                            if(!isPostComment){
                                replyParam.parentComment = {
                                    nickname: replayNickname,
                                    commer: replayCommer
                                }
                            }
                            handleOk(replyParam);
                        }else{
                            handleCancel();
                        }
                    }).catch(() => {handleCancel();});
            }
        });
    }
    /*
     * 处理输入框获取焦点事件,并隐藏表情
     */
    handleTextFocus() {
        this.setState({showEmoji: false});
    }
    /*
     * 处理textarea失去焦点事件,并保存最后一次的焦点位置
     */
    handleTextBlur(){
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("content"),
            textarea = _context.refs.textarea;
        textarea.blur();
        this.savePos(textarea);
    }
    /*
     * 点击表情图标，弹出表情轮播图
     */
    handleEmojiIconClick(e) {
        e.stopPropagation();
        e.preventDefault();
        let {showEmoji} = this.state;
        this.setState({
            showEmoji: !showEmoji
        });
        this.handleTextBlur();
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
     * 关闭用户选择列表
     */
    handleUserClose(){
        this.setState({
            showUserList: false
        });
    }
    /*
     * 处理联系人列表点击事件,并把选中的用户名加入textarea中
     * @param username    选中的用户名
     */
    handleUserClick(username){
        this.setState({
            showUserList: false
        });
        this.setTextAreaValue("@" + username + " ");
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
    // 取消发布
    cancelPublish(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleCancel();
    }
    // 显示@用户列表
    handleShowUser(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({showUserList: true});
        this.handleTextBlur();
    }

    render() {
        const {getFieldProps, getFieldError} = this.props.form;
        let {showEmoji, showUserList} = this.state;
        let {replayNickname, isPostComment} = this.props;
        return (
            <div class="post-comment-wrap">
                <header>
                    <div class="pop-over-write-comment-header-cont">
                        <Button inline className="pop-over-write-comment-btn fl" onClick={this.cancelPublish.bind(this)}>取消</Button>
                        <span>发布评论</span>
                        <Button inline className="pop-over-write-comment-btn fr" onClick={this.handleSubmit.bind(this)}>发布</Button>
                    </div>
                </header>
                <div className="write-post-form">
                    <List className="pop-over-write-comment-content write-post-no-bottom">
                        <TextareaItem
                            {...getFieldProps('content', { rules: [{required: true}] })}
                            rows={4}
                            count={100}
                            placeholder={isPostComment ? "写评论..." : "回复@" + replayNickname + ":"}
                            onFocus={this.handleTextFocus.bind(this)}
                            onBlur={this.handleTextBlur.bind(this)}
                        /> {getFieldError('content')
                            ? <span class="comment-error-tip">帖子内容不能为空</span>
                            : null}
                    </List>
                    <List className="pop-over-write-comment-content">
                        <Flex className="comment-flex">
                            <Item onClick={this.handleShowUser.bind(this)} className="comment-flex-item">
                                <div class="at-icon"></div>
                            </Item>
                            <Item className="comment-flex-item" onClick={this.handleEmojiIconClick.bind(this)}>
                                <div class="emoji-icon"></div>
                            </Item>
                        </Flex>
                    </List>
                    {showEmoji
                        ? <EmojiGrid handleEmojiClick={this.handleEmojiClick.bind(this)}/>
                        : ""}
                </div>
                {showUserList
                    ? <AtUserList handleUserClick={this.handleUserClick.bind(this)} handleUserClose={this.handleUserClose.bind(this)}/>
                    : ""}
            </div>
        )
    }
}
export default createForm()(CommentWindow);
