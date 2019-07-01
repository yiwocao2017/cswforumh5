import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import NormalHeader from '../../NormalHeader';
import LikeListItem from './LikeListItem';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';

const Util = require('../../../util/util');

export default class LikeList extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            postData: []
        }
    }
    componentDidMount() {
        Util.showLoading();
        this.getPageLikePost(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(()=>{});
        GeneralCtr.recordPageView();
    }
    handleLoadMore(resolve) {
        this.getPageLikePost().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageLikePost(true).then(resolve).catch(resolve);
    }
    // 分页查询收到的点赞帖子
    getPageLikePost(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPageLikePost({
            start,
            limit
        }, refresh).then((data) => {
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

    render(){
        let {hasMore, initializing, refreshedAt, postData} = this.state;

        return (
            <div class="box">
                <NormalHeader title="赞"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headline">
                    <div class="wp100">
                        {
                            postData.length ? postData.map((data, index) => (
                                <LikeListItem key={data.code} postData={data}/>
                            ))
                            : Util.noData("暂无被点赞的帖子")
                        }
                    </div>
                </Tloader>
            </div>
        );
    }
}
