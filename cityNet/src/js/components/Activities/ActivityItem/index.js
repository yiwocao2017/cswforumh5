import React, {Component} from 'react';
import {Link} from 'react-router';
import className from 'classnames';
import './index.scss';

const Util = require('../../../util/util');

export default class ActivityItem extends Component {
    handleClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin(true);
            return;
        }
        if(this.result.disabled)
            return;
        let {activity} = this.props;
        if(this.result.pay){
            Util.goPath(`/actPay/${activity.orderCode}`);
            return;
        }
        Util.goPath(`/apply/${activity.code}`);
    }
    // 解析活动状态
    analyzeStatus(activity){
        let now = new Date((new Date().format("yyyy-MM-dd hh:mm:ss"))).getTime(),
            start = new Date(new Date(activity.beginDatetime).format("yyyy-MM-dd hh:mm:ss")).getTime(),
            end = new Date(new Date(activity.endDatetime).format("yyyy-MM-dd hh:mm:ss")).getTime();
        let result = {
            text: "报名中"
        };
        if(now >= end){
            result.text = "已结束";
            result.end = true;
        }
        // else if(now >= start){
        //     result.text = "进行中";
        // }
        return result;
    }
    render() {
        /*DRAFT("0", "活动草稿"), ONLINE("1", "上架活动"), OFFLINE("2", "下架活动"), END("3",
            "结束活动");*/
        let {activity} = this.props;
        this.result = Util.getStatusAndText(activity);
        let act_status = this.analyzeStatus(activity);
        return (
            <div class="activity-item-container">
                <Link className="link_block" to={`/activity/${activity.code}`}>
                    <header class="activity-item-title">
                        <h1>{activity.title}</h1>
                        <div class="sub-title">活动时间：{Util.formatDate(activity.beginDatetime)} ~ {Util.formatDate(activity.endDatetime)}</div>
                    </header>
                    <div class="activity-item-img-container">
                        <img onLoad={Util.handleOnLoad} src={Util.formatImg(activity.pic1)}/>
                    </div>
                    <div class="activity-item-status-container">
                        <span class={className({
                            "activity-status": 1,
                            "end-status": act_status.end
                        })}>{act_status.text}</span>
                        <span>已报名<span class="activity-apply-num">{activity.signNum}</span>人/{activity.limitNum}人</span>
                        <div class={className({
                            "normal-btn-small": 1,
                            "fr": 1,
                            "disabled": this.result.disabled
                        })} onClick={this.handleClick.bind(this)}>
                            {this.result.text}
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}
