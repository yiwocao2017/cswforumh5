import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import CommodityItem from '../../../CommodityList/CommodityItem';
import {GeneralCtr} from '../../../../controller/GeneralCtr';
import {MallCtr} from '../../../../controller/MallCtr';
import './index.scss';

const Util = require('../../../../util/util');

export default class CommodityOrderItem extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            orderList: [],
            status: ""                  //当前查询的订单的状态
        };
    }
    componentWillMount() {
        this.setState({
            status: this.props.status
        });
    }
    componentDidMount() {
        Util.showLoading();
        this.getPageOrder(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 分页获取商品订单
    getPageOrder(refresh){
        let {status} = this.state;
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return MallCtr.getPageOrder({
            status,
            start,
            limit
        }).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {orderList} = this.state;
            orderList = refresh && [] || orderList;
            orderList = [].concat.call(orderList, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                orderList
            });
        })
    }
    handleLoadMore(resolve) {
        this.getPageOrder().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageOrder(true).then(resolve).catch(resolve);
    }
    render() {
        let {hasMore, initializing, refreshedAt, orderList} = this.state;
        return (
            <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader user-commodity">
                <div class="wp100 ptb10 commodity-user-list">
                    <ul class="wp100 over-hide plr5 border-box">
                        {
                            orderList.length ? orderList.map((order, index) => {
                                order.productOrderList[0].code = order.productOrderList[0].productCode;
                                order.productOrderList[0].name = order.productOrderList[0].product.name;
                                order.productOrderList[0].advPic = order.productOrderList[0].product.advPic;
                                return <CommodityItem key={order.code} commodity={order.productOrderList[0]}/>
                            }) : Util.noData("暂无商品")
                        }
                    </ul>
                </div>
            </Tloader>
        );
    }
}
