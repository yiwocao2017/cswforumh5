import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../NormalHeader';
import Tloader from 'react-touch-loader';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');
const rightIcon = require('../../../../images/_pic.png');

export default class PraiseList extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 36,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            userList: []
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getPagePraise(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
    }
    // 分页获取打赏列表
    getPagePraise(refresh){
        let {code} = this.props.params;
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPagePostPraise({
            postCode: code,
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
        this.getPagePraise().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPagePraise(true).then(resolve).catch(resolve);
    }
    render() {
        let {hasMore, initializing, refreshedAt, userList} = this.state;
        const list = userList.length
            ? userList.map((user, index) => (
                <Link to={`/user/${user.talker}`} key={`index${index}`} class="wp100 pr">
                    <div class="follow-img plr15 w70 h50 bg_fff"><img class="wp100" src={Util.formatListThumbanailAvatar(user.photo)}/></div>
                    <div class="follow-txt h50 b_e6_b pl70 wp100">{user.nickname}<img class="follow-l" src={rightIcon}/></div>
                </Link>
            ))
            : "";
        return (
            <div>
                <NormalHeader title="打赏列表"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                    <div class="wp100 bg_fff follow-list b_e6_b">
                        {list}
                    </div>
                </Tloader>
            </div>
        );
    }
}
