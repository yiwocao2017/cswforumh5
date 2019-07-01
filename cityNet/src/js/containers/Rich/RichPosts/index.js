import React, {Component} from 'react';
import RichHeader from '../../../components/RichHeader';
import Nav from '../../../components/Nav';
import NormalPostItem from '../../../components/NormalPostItem';
import Tloader from 'react-touch-loader';
import {globalInfo} from '../../../containers/App';
import {PostCtr} from '../../../controller/PostCtr';

import './index.scss';

const Util = require('../../../util/util');

export default class RichPosts extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),
            postData: [],
        };
        this.isLoading = false;
    }
    componentDidMount() {
        // 如果是当前页面就加载
        if(/#\/rich\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate(){
        // 如果是当前页面就加载
        if(/#\/rich\?/.test(location.href)){
            this.initData();
        }
    }
    // 页面初始化的逻辑代码
    initData(){
        let {initializing} = this.state;
        if(initializing !== 2 && !this.isLoading){
            this.isLoading = true;
            Util.showLoading();
            this.getPagePost()
                .then(() => {
                    this.setState({
                        initializing: 2
                    });
                    this.isLoading = false;
                    Util.hideLoading();
                }).catch(() => {});
        }
    }
    // 分页获取帖子列表
    getPagePost(refresh){
        let {location} = this.props;
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        let param = {
            start,
            limit,
            location   // A 置顶 B 精华 C 头条
        };
        if(!location){
            param.orderColumn = "publish_datetime";
            param.orderDir = "desc";
        }
        return PostCtr.getPagePost(param, refresh)
            .then((data) => {
                let hasMore = data.list.length >= limit || 0;
                let {postData} = this.state;
                postData = refresh && [] || postData;
                postData = [].concat.call(postData, data.list);
                hasMore && start++;
                this.setState({
                    hasMore,
                    start,
                    postData
                });
            });
    }
    // 加载更多帖子
    handleLoadMore(resolve) {
        this.getPagePost()
            .then(resolve).catch(resolve);
    }
    // 刷新帖子数据
    handleRefresh(resolve) {
        this.getPagePost(true)
            .then(resolve).catch(resolve);
    }
    // 点赞
    handleLikeClick(item){
        let {postData} = this.state,
            index = Util.findItemInArr(postData, item, "code");
        if(index != -1){
            if(item.isDZ == "0"){
                postData[index].isDZ = "1";
                postData[index].sumLike = +item.sumLike + 1;
                postData[index].likeList.push({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname
                });
            }else{
                postData[index].isDZ = "0";
                postData[index].sumLike = +item.sumLike - 1;
                let likeList = postData[index].likeList || [];
                let likeIndex = Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker");
                if(likeIndex != -1){
                    likeList.splice(likeIndex, 1);
                }
                postData[index].likeList = likeList;
            }
            this.setState({postData});
        }
    }
    render() {
        let {hasMore, initializing, refreshedAt, postData} = this.state;
        let postItems = postData.length ? postData.map((data, index) => (
            <NormalPostItem
                handleLikeClick={this.handleLikeClick.bind(this)}
                key={data.code}
                pData={data}
                showComment={true}
                showCarousel={this.props.showCarousel}
                toUrl='/rich'
            />
        )) : Util.noData("暂无帖子");
        return (
            <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="">
                <div class="rich_list">
                    <ul>{postItems}</ul>
                </div>
            </Tloader>
        )
    }
}
