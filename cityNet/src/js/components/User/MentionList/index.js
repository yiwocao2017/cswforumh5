import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import MentionListHeader from './MentionListHeader';
import NormalPostItem from '../../NormalPostItem';
import CommentListItem from '../CommentList/CommentListItem';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class MentionList extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start1: 1,
            start2: 1,
            hasMore1: 0,
            hasMore2: 0,
            hasMore: 0,

            initializing: 2,
            refreshedAt: Date.now(),

            postData1: null,
            postData2: null,
            type: 1
        }
    }
    componentWillMount() {
        let {type} = this.props.params;
        this.setState({type});
    }
    componentDidMount() {
        Util.showLoading();
        this.judgeGetPostType(this.state.type, true).then(Util.hideLoading).catch(()=>{});
        GeneralCtr.recordPageView();
    }
    componentWillReceiveProps(nextProps){
        let {type} = this.state,
            nextType = nextProps.params.type;
        if(type != nextType){
            this.setState({
                type: nextType
            });
            if(!this.state["postData" + nextType]){
                Util.showLoading();
                this.judgeGetPostType(nextProps.params.type, true).then(Util.hideLoading).catch(()=>{});
            }else{
                // this.judgeGetPostType(nextProps.params.type);
            }
        }
    }
    handleLoadMore(resolve) {
        this.judgeGetPostType(this.state.type).then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.judgeGetPostType(this.state.type, true).then(resolve).catch(resolve);
    }
    judgeGetPostType(type, refresh){
        // let {type} = this.props.params;              //  type=1 发出的、type=2 收到的
        if(type == 1){
            return this.getPageMentionMyPost(refresh);
        }
        return this.getPageMentionMyComment(refresh);
    }
    // 分页查询提到我的帖子
    getPageMentionMyPost(refresh){
        let {start1, limit} = this.state;
        start1 = refresh && 1 || start1;
        return PostCtr.getPageMentionMyPost({
            start: start1,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData1} = this.state;
            postData1 = refresh && [] || postData1;
            postData1 = [].concat.call(postData1, data.list);
            hasMore && start1++;
            this.setState({
                hasMore1: hasMore,
                hasMore,
                start1,
                postData1
            });
        });
    }
    // 分页查询提到我的评论
    getPageMentionMyComment(refresh){
        let {start2, limit} = this.state;
        start2 = refresh && 1 || start2;
        return PostCtr.getPageMentionMyComment({
            start: start2,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData2} = this.state;
            postData2 = refresh && [] || postData2;
            postData2 = [].concat.call(postData2, data.list);
            hasMore && start2++;
            this.setState({
                hasMore2: hasMore,
                hasMore,
                start2,
                postData2
            });
        });
    }
    // 点赞
    handleLikeClick(item){
        let {postData1} = this.state,
            index = Util.findItemInArr(postData1, item, "code");
        if(index != -1){
            if(item.isDZ == "0"){
                postData1[index].isDZ = "1";
                postData1[index].sumLike = +item.sumLike + 1;
                postData1[index].likeList.push({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname
                });
            }else{
                postData1[index].isDZ = "0";
                postData1[index].sumLike = +item.sumLike - 1;
                let likeList = postData1[index].likeList || [];
                let likeIndex = Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker");
                if(likeIndex != -1){
                    likeList.splice(likeIndex, 1);
                }
                postData1[index].likeList = likeList;
            }
            this.setState({postData1});
        }
    }

    render(){
        let {hasMore, initializing, refreshedAt, postData1, postData2} = this.state;
        let {type} = this.state;
        let postData = type == 1 ? postData1 : postData2;
        return (
            <div class="box">
                <MentionListHeader pageTitle="评论" activeNavIndex={type}/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                    <div class="wp100">
                        {
                            type == 1
                            ? postData1 && postData1.length
                                    ? (
                                        <div class="rich_list">
                                            <ul>
                                                {postData1.map((data, index) => (
                                                    <NormalPostItem
                                                        key={data.code}
                                                        type={type}
                                                        pData={data}
                                                        handleLikeClick={this.handleLikeClick.bind(this)}
                                                        showCarousel={this.props.showCarousel}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                    : Util.noData("暂无提到我的帖子")
                            :
                            <div class="wp100">
                                {
                                    postData2 && postData2.length
                                        ? postData2.map((data, index) => (
                                            <CommentListItem key={data.code} type={type} postData={data}/>
                                        ))
                                        : Util.noData("暂无提到我的评论")
                                }
                            </div>
                        }
                    </div>
                </Tloader>
            </div>
        );
    }
}
