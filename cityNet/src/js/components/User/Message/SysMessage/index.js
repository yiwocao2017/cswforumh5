import React, {Component} from 'react';
import NormalHeader from '../../../NormalHeader';
import Tloader from 'react-touch-loader';
import {List, Flex} from 'antd-mobile';
import {GeneralCtr} from '../../../../controller/GeneralCtr';

import './index.scss';

const Util = require('../../../../util/util');
const mesIcon = require('../../../../../images/message-icon.png');

export default class SysMessage extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            messageData: []
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getPageSysMessage(true)
            .then(() => {
                Util.hideLoading();
                this.setState({
                    initializing: 2
                });
            }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 分页获取系统消息
    getPageSysMessage(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return GeneralCtr.getPageSysMessage({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {messageData} = this.state;
            messageData = refresh && [] || messageData;
            messageData = [].concat.call(messageData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                messageData
            });
        });
    }
    // 加载更多系统消息
    handleLoadMore(resolve) {
        this.getPageSysMessage()
            .then(resolve).catch(resolve);
    }
    // 刷新系统消息
    handleRefresh(resolve) {
        this.getPageSysMessage(true)
            .then(resolve).catch(resolve);
    }

    render() {
        let {hasMore, initializing, refreshedAt, messageData} = this.state;
        return (
            <div class="box">
                <NormalHeader title="系统消息"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader">
                    {
                        messageData.length
                            ? (
                                <List class="sys-message-wrap">
                                    {
                                        messageData.map((item, index) => (
                                            <List.Item class="sms-list-item" key={`index${index}`}>
                                                <Flex align="start">
                                                    <img class="left-icon" src={mesIcon}/>
                                                    <Flex.Item>
                                                        <header class="sms-title">
                                                            <h2>{item.smsTitle}</h2>
                                                            <div class="sms-sub">{Util.formatDate(item.pushedDatetime, "yyyy-MM-dd")}</div>
                                                        </header>
                                                        <div class="sms-cont" dangerouslySetInnerHTML={{__html: item.smsContent}}></div>
                                                    </Flex.Item>
                                                </Flex>
                                            </List.Item>
                                        ))
                                    }
                                </List>
                            )
                            : Util.noData("暂无系统消息")
                    }
                </Tloader>
            </div>
        )
    }
}
