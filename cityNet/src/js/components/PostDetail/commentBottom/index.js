import React, {Component} from 'react';
import {Flex, ActionSheet, Toast, Modal} from 'antd-mobile';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const dianzNormal = require("../../../../images/dianz-normal.png");
const dianzRed = require("../../../../images/dianz-red.png");
const moreIcon = require('../../../../images/更多操作@2x.png');

const Util = require('../../../util/util');

export default class CommentBottom extends Component {
    constructor(){
        super();
        this.state = {
            showComment: 0
        };
    }
    // 点击底部的评论输入框，弹出评论组件
    handleInputClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        this.props.handleCommentInputClick();
    }
    // 点击页面底部更多（...）按钮，弹出操作选项
    showActionSheet(e) {
        e.preventDefault();
        e.stopPropagation();
        let {isSC, isMine} = this.props;
        let BUTTONS;
        if(isSC != "0"){
            BUTTONS = ['取消收藏'];
        }else{
            BUTTONS = ['收藏'];
        }
        if(isMine){
            BUTTONS.push('删除');
        }else{
            BUTTONS.push('举报');
        }
        BUTTONS.push('取消');
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            message: '操作',
            maskClosable: true,
            'data-seed': 'logId',
        }, (buttonIndex) => {
            if(buttonIndex != 2 && !Util.isLogin()){
                Util.goLogin();
                return;
            }
            this.handleOptionClick(buttonIndex);
        });
    }
    // 点击showActionSheet弹出的选项
    handleOptionClick(index){
        let {isSC, isMine} = this.props;
        if(index == 0){ // 收藏、取消收藏
            this.scPost();
        }else if(index == 1){
            if(isMine){ // 删除帖子
                Modal.alert('删除', '确定删除帖子吗?', [
                    { text: '取消', onPress: () => {} },
                    { text: '确定', onPress: () => this.deletePost() },
                ]);
            }else{ // 举报
                Modal.prompt('举报帖子', '举报理由', [
                    { text: '取消' },
                    { text: '举报', onPress: value => this.reportPost(value) },
                ], 'plain-text');
            }
        }
    }
    // 点击页面底部的点赞按钮
    handleDZClick(e){
        e.stopPropagation();
        e.preventDefault();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        PostCtr.dzPost(this.props.code)
            .then((data) => {
                this.props.handleDZ();
            }).catch(() => {});
    }
    // 收藏帖子
    scPost(type){
        let {handleSC, isSC, code} = this.props;
        PostCtr.scPost(code)
            .then((data) => {
                let msg = isSC == "0" ? "收藏成功" : "取消收藏成功";
                Toast.success(msg, 1);
                handleSC();
            }).catch(() => {});
    }
    // 删除帖子
    deletePost() {
        let {code} = this.props;
        PostCtr.deletePost([code])
            .then((data) => {
                Toast.success("删除成功", 1);
                setTimeout(Util.historyBack, 1e3);
            }).catch(() => {});
    }
    // 举报帖子 type 1 帖子 2 评论
    reportPost(reportNote){
        if(Util.isEmptyString(reportNote)){
            Toast.info("举报理由不能为空");
            return;
        }
        Util.showLoading("举报中...");
        PostCtr.reportPost(this.props.code, reportNote)
            .then((data) => {
                Toast.success("举报成功", 1);
            }).catch(() => {});
    }
    render(){
        let {isDZ, isSC, isMine, code} = this.props;
        return (
            <div>
                <div class="post-comment-bottom">
                    <div class="post-comment-input" onClick={this.handleInputClick.bind(this)}>回个话鼓励下楼主</div>
                    <Flex>
                        <Flex.Item onClick={this.handleDZClick.bind(this)}>
                            <img src={isDZ == "0" ? dianzNormal : dianzRed} class="post-comment-img"/>
                        </Flex.Item>
                        <Flex.Item onClick={this.showActionSheet.bind(this)}>
                            <img src={moreIcon} class="post-comment-img post-comment-more"/>
                        </Flex.Item>
                    </Flex>
                </div>
            </div>
        );
    }
}
