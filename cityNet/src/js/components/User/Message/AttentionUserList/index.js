import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../NormalHeader';
import Tloader from 'react-touch-loader';
import './index.scss';

const Util = require('../../../../util/util');
const Ajax = require('../../../../util/ajax');
const rightIcon = require('../../../../../images/_pic.png');

export default class AttentionUserList extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            userList: []
        };
    }
    componentDidMount() {
        Util.showLoading();
        Ajax.post("610400", {
            companyCode: Util.getCompany().code
        });
        this.getPageFollows(true)
            .then(() => {
                this.setState({initializing: 2});
                Util.hideLoading();
            }).catch(() => {});
    }
    // 分页查询关注
    getPageFollows(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return Ajax.get("805090", {
            start,
            limit,
            userId: localStorage["userId"]
        }, refresh)
            .then((data) => {
                let hasMore = data.list.length >= limit || 0;
                let {userList} = this.state;
                userList = refresh && [] || userList;
                userList = [].concat.call(userList, data.list);
                hasMore && start++;
                this.setState({
                    hasMore,
                    start,
                    userList
                });
            });
    }
    handleLoadMore(resolve) {
        this.getPageFollows().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageFollows(true).then(resolve).catch(resolve);
    }
    render() {
        let {hasMore, initializing, refreshedAt, userList} = this.state;
        const list = userList.length
            ? userList.map((user, index) => (
                <Link to={`/user/chatRoom/${user.userId}`} key={`index${index}`} class="wp100 pr">
                    <div class="follow-img plr15 w70 h50 bg_fff"><img class="wp100" src={Util.formatListThumbanailAvatar(user.photo)}/></div>
                    <div class="follow-txt h50 b_e6_b pl70 wp100">{user.nickname}<img class="follow-l" src={rightIcon}/></div>
                </Link>
            ))
            : Util.noData("暂无关注的人");
        return (
            <div class="box">
                <NormalHeader title="发起聊天"/>
                <Tloader refreshedAt={refreshedAt} initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                    <div class="wp100 bg_fff follow-list b_e6_b">
                        {list}
                    </div>
                </Tloader>
            </div>
        );
    }
}
