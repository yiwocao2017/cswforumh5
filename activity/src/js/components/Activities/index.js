import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import ActivityItem from './ActivityItem';
import {ActivityCtr} from '../../controller/ActivityCtr';
import NormalHeader from '../NormalHeader';
import './index.scss';

const Util = require('../../util/util.js');

export default class Activities extends Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),
            activities: []
        };
    }
    componentDidUpdate(){
        if(document.title != "同城活动" && /#\/list\?/.test(location.href)){
            Util.setTitle("同城活动");
        }
    }
    componentDidMount() {
        Util.showLoading("加载中...");
        this.getPageActivities(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
    }
    // 分页查询活动列表
    getPageActivities(refresh) {
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return ActivityCtr.getPageActivities({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {activities} = this.state;
            activities = refresh && [] || activities;
            activities = [].concat.call(activities, data.list);
            hasMore && start++;
            this.setState({hasMore, start, activities});
        });

    }
    // 加载更多活动
    handleLoadMore(resolve) {
        this.getPageActivities().then(resolve).catch(resolve);
    }
    // 刷新数据
    handleRefresh(resolve) {
        this.getPageActivities(true).then(resolve).catch(resolve);
    }
    // 返回事件
    goBack(){
        try {
            if(Util.is_mobile() && !Util.is_wechat()){
                if(Util.is_ios() && window.webkit){
                    let json = JSON.stringify({
                        event: "return"
                    });
                    window.webkit.messageHandlers.webviewEvent.postMessage(json);
                }else if(window.android){
                    window.android.back();
                }else{
                    location.href = CSW_URL;
                }
            }else{
                location.href = CSW_URL;
            }
        }catch(e){
            Toast.info("error" + e);
        }
    }
    render() {
        let {initializing, hasMore, activities} = this.state;
        return (
            <div>
                <div class="box" style={{
                    display: this.props.children ? "none": ""
                }}>
                    <NormalHeader goBack={this.goBack.bind(this)} title="同城活动"/>
                    <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true}>
                        {activities.length
                            ? activities.map((item, index) => (<ActivityItem key={item.code} activity={item}/>))
                            : Util.noData("暂无活动")
                        }
                    </Tloader>
                </div>
                {this.props.children}
            </div>
        )
    }
}
