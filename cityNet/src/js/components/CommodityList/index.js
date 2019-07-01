import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../NormalHeader';
import Tloader from 'react-touch-loader';
import CommodityItem from './CommodityItem';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {MallCtr} from '../../controller/MallCtr';
import './index.scss';

const Util = require('../../util/util');
const Ajax = require('../../util/ajax');

export default class CommodityList extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            company: {},
            commodityList: []
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getPageCommodity(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading()
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 分页获取商品
    getPageCommodity(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return MallCtr.getPageCommodity({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {commodityList} = this.state;
            commodityList = refresh && [] || commodityList;
            commodityList = [].concat.call(commodityList, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                commodityList
            });
        })
    }
    handleLoadMore(resolve) {
        this.getPageCommodity().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageCommodity(true).then(resolve).catch(resolve);
    }
    render() {
        let {hasMore, initializing, refreshedAt, commodityList} = this.state;
        return (
            <div class="box">
                <NormalHeader title="赏金商城"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="user-commodity tloader headNoBottom">
                    <div class="wp100 ptb10 commodity-user-list">
                        {
                            commodityList.length
                            ? <ul class="wp100 over-hide plr5 border-box">
                                {
                                    commodityList.map((item, index) => (
                                        <CommodityItem commodity={item} key={item.code}/>
                                    ))
                                }
                            </ul>
                            : Util.noData("暂无商品")
                        }
                    </div>
                </Tloader>
            </div>
        );
    }
}
