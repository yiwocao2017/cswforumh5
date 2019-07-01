import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../NormalHeader';
import Tloader from 'react-touch-loader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');
const rightIcon = require('../../../../images/_pic.png');

export default class FansOrAttention extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 20,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            userList: []
        };
    }
    componentDidMount() {
        let {type} = this.props.params;     //  type=0 关注 type=1 粉丝
        Util.showLoading();
        if(type == 1)
            this.getPageFans(true).then(() => {
                this.setState({initializing: 2});
                Util.hideLoading();
            }).catch(() => {});
        else
            this.getPageFollows(true).then(() => {
                this.setState({initializing: 2});
                Util.hideLoading();
            }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 分页查询粉丝
    getPageFans(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return UserCtr.getPageFans({
            start,
            limit
        }, refresh).then((data) => {
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
    // 分页查询关注
    getPageFollows(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return UserCtr.getPageFollows({
            start,
            limit
        }, refresh).then((data) => {
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
        let {type} = this.props.params;     //  type=0 关注 type=1 粉丝
        if(type == 1)
            this.getPageFans().then(resolve).catch(resolve);
        else
            this.getPageFollows().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        let {type} = this.props.params;     //  type=0 关注 type=1 粉丝
        if(type == 1)
            this.getPageFans(true).then(resolve).catch(resolve);
        else
            this.getPageFollows(true).then(resolve).catch(resolve);
    }
    render() {
        let {type} = this.props.params;
        let {hasMore, initializing, refreshedAt, userList} = this.state;
        let title = type == "1"
            ? "粉丝"
            : "关注";
        const list = userList.length
            ? userList.map((user, index) => (
                <Link to={`/user/${user.userId}`} key={user.userId} class="wp100 pr">
                    <div class="follow-img plr15 w70 h50 bg_fff"><img class="wp100" src={Util.formatListThumbanailAvatar(user.photo)}/></div>
                    <div class="follow-txt h50 b_e6_b pl70 wp100">{user.nickname}<img class="follow-l" src={rightIcon}/></div>
                </Link>
            ))
            : Util.noData("暂无" + title);
        return (
            <div class="box">
                <NormalHeader title={title}/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                    <div class="wp100 bg_fff follow-list b_e6_b">
                        {list}
                    </div>
                </Tloader>
            </div>
        );
    }
}
