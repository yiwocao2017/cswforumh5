import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../components/NormalHeader';
import Tloader from 'react-touch-loader';
import {Flex} from 'antd-mobile';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const getMoneyIcon = require('../../../../images/getMoney-icon.png');
const mallIcon = require('../../../../images/mall-icon.png');
const Util = require('../../../util/util');

export default class UserReward extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 20,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            rewardList: []
        };
        this.accountNumber = "";
    }
    componentDidMount() {
        Util.showLoading();
        this.getAccount()
            .then((data) => {
                this.getPageFlow(true).then(() => {
                    this.setState({
                        initializing: 2
                    });
                    Util.hideLoading();
                });
            });
        GeneralCtr.recordPageView();
    }
    // 获取账户信息
    getAccount(){
        return UserCtr.getAccount(true)
            .then((data) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].currency == "JF"){
                        this.accountNumber = data[i].accountNumber;
                        return data;
                    }
                }
            });
    }
    // 分页查流水
    getPageFlow(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return GeneralCtr.getPageFlow({
            start,
            limit,
            accountNumber: this.accountNumber
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {rewardList} = this.state;
            rewardList = refresh && [] || rewardList;
            rewardList = [].concat.call(rewardList, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                rewardList
            });
        })
    }
    handleLoadMore(resolve) {
        this.getPageFlow().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPageFlow(true).then(resolve).catch(resolve);
    }
    render() {
        let {hasMore, initializing, refreshedAt, rewardList} = this.state;
        return (
            <div class="box">
                <NormalHeader title="赏金详情"/>
                <div class="wp100 reward-nav-wrap">
                    <Flex justify="center">
                        <Flex.Item>
                            <div class="reward-nav"><Link to='/mall/list'><img src={mallIcon}/>赏金商城</Link></div>
                        </Flex.Item>
                        <Flex.Item>
                            <div class="reward-nav"><Link to='/user/aboutJF'><img src={getMoneyIcon}/>如何赚赏金</Link></div>
                        </Flex.Item>
                    </Flex>
        		</div>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="rewardLoader headNoBottom">
                    <div class="wp100 bg_fff">
                        {
                            rewardList.length
                                ? rewardList.map((item, index) => {
                                    let positive = +item.transAmount >= 0 ? true : false,
                                        transClass = positive && "t_red" || "t_21b504",
                                        prefix = positive && "+" || ""
                                    return(
                                        <div key={`index${index}`} class="wp100 reward-list b_e6_b">
                            				<div>{item.bizNote}</div>
                            				<div class="tc"><samp class={transClass}>{prefix}{Util.formatMoney(item.transAmount)}</samp>赏金</div>
                            				<div class="tr">{Util.formatDate(item.createDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                            			</div>
                                    )
                                }) : Util.noData("暂无赏金流水")
                        }
            		</div>
                </Tloader>
            </div>
        );
    }
}
