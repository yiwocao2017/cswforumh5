import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../components/NormalHeader';
import Tloader from 'react-touch-loader';
import {ActivityIndicator} from 'antd-mobile';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');
const postEmojiUtil = require('../../../util/postEmoji');

export default class DraftBox extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            postData: []
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getPagePost(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 分页获取帖子列表
    getPagePost(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPageDraftPost({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData} = this.state;
            postData = refresh && [] || postData;
            postData = [].concat.call(postData, data.list);
            hasMore && start++;
            this.setState({
                hasMore: hasMore,
                start: start,
                postData: postData
            });
        });
    }
    handleLoadMore(resolve) {
        this.getPagePost()
            .then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPagePost(true)
            .then(resolve).catch(resolve);
    }
    // 处理帖子内容点击事件，判断如果点击@用户 时，跳转到用户中心
    handleContentClick(e){
        e.stopPropagation();
        e.preventDefault();
        let target = e.target;
        // 如果点击的是@用户 这个区域，则根据当前区域的nickname去获取userId，然后跳转到用户中心
        if(/^goUserCenterSpan$/.test(target.className)){
            e.preventDefault();
            e.stopPropagation();
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
    // 点击重发跳转到发帖页面
    goWritePostPage(post, e){
        e.stopPropagation();
        e.preventDefault();
        Util.goPath(`/write?code=${post.code}`);
    }
    render() {
        let {hasMore, initializing, refreshedAt, postData} = this.state;
        return (
            <div class="box draftWrap">
                <NormalHeader title="草稿箱"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                    {
                        postData.length
                        ? postData.map((post, index) => (
                            <div key={`index${index}`} class="wp100 bg_fff p10 b_e6_tb mb10 pr border-box">
                                <div>
                                    <div class="fs14 pb10">存稿时间：{Util.formatDate(post.publishDatetime)}</div>
                                    <input type="button" onClick={this.goWritePostPage.bind(this, post)} value="重发" class="btn-sendOut" />
                                </div>
                                <div class="fs14">标题：{post.title}</div>
                                <div class="fs14 pt10 draft-cont" onClick={this.handleContentClick.bind(this)}>内容：{
                                    postEmojiUtil.parseEmojiContent(post.content.substr(0, 40))}
                                    {post.content.length > 40 ? "..." : ""}
                                </div>
                            </div>
                        )) : Util.noData("草稿箱内暂无帖子")
                    }
                </Tloader>
            </div>
        );
    }
}
