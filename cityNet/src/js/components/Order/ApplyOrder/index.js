import React, {Component} from 'react';
import {Link} from 'react-router';
import {Flex, InputItem, Stepper, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../NormalHeader';
import {ActivityCtr} from '../../../controller/ActivityCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util.js');

class ApplyOrder extends Component {
    constructor(){
        super();
        this.state = {
            activity: {},
            user: {},
            quantity: 1
        };
    }
    componentDidMount(){
        Util.showLoading();
        this.init()
            .then(Util.hideLoading)
            .catch(() => {});
    }
    init(){
        return Promise.all([
            this.getUserInfo(),
            this.getActivity()
        ]);
    }
    // 获取用户详情
    getUserInfo(){
        return UserCtr.getUserInfo()
            .then((user) => {
                this.setState({user});
            });
    }
    // 获取活动详情
    getActivity(){
        let {code} = this.props.params;
        return ActivityCtr.getActivity(code, 1)
            .then((activity) => {
                this.setState({activity});
            });
    }
    // 提交订单
    applyOrder(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin(true);
            return;
        }
        let {activity} = this.state;
        this.props.form.validateFields((error, param) => {
            if(!error){
                if(!param.realName){
                    Toast.info("姓名不能为空", 1);
                    return;
                }
                let {quantity, user} = this.state;
                param.mobile = user.mobile;
                param.productCode = this.props.params.code;
                param.quantity = quantity;
                Util.showLoading("提交中...");
                ActivityCtr.applyActivity(param)
                    .then((data) => {
                        // 如果免费，则直接调支付接口
                        if(!activity.fee){
                            ActivityCtr.payOrder(data.code)
                                .then(() => {
                                    Toast.success("报名成功", 1);
                                    setTimeout(() => {
                                        Util.goPath(`/activity`, 1);
                                    }, 1000);
                                }).catch(() => {});
                            return;
                        }
                        Util.hideLoading();
                        Util.goPath(`/actPay/${data.code}`);
                    }).catch(() => {});
            }
        });
    }
    // 票数的change事件
    onNumChange(quantity){
        this.setState({quantity});
    }
    goBack(){
        let {activity} = this.state;
        if(sessionStorage.getItem("isback")){
            Util.goPath(`/activity/${activity.code}`);
        }else{
            Util.historyBack();
        }
    }
    render() {
        let {activity, user, quantity} = this.state;
        let unitPrice = activity && activity.fee || 0,
            totalAmount = 0;
        if(!isNaN(quantity)){
            totalAmount = unitPrice * quantity;
        }
        let {getFieldProps, getFieldError} = this.props.form;
        let realNameError;
        return (
            <div class="apply-order-container">
                <NormalHeader goBack={this.goBack.bind(this)} fixed={true} title="报名付费"/>
                <div style={{"height": "0.88rem"}}></div>
                <header class="order-act-item">
                    <Link className="link_block" to={`/activity/${activity.code}`}>
                        <Flex>
                            <div class="order-act-item-img-wrap">
                                <img onLoad={Util.handleOnLoad} src={Util.formatTitleThumbanailImg(activity.pic1)}/>
                            </div>
                            <Flex className="order-cont-flex" direction="column" justify="between" align="start">
                                <div class="order-act-title">{activity.title}</div>
                                <div class="order-act-addr">{activity.holdPlace}</div>
                                <div class="order-act-date">{Util.formatDate(activity.beginDatetime)}~{Util.formatDate(activity.endDatetime)}</div>
                            </Flex>
                        </Flex>
                    </Link>
                </header>
                <div class="mt20 apply-order-info-cont">
                    <div class="am-list-item am-input-item">
                        <div class="am-input-label am-input-label-5">收费票</div>
                        <div class="am-input-control">
                            1张<span class="each-price">{Util.formatMoney(activity.fee)}</span>元
                        </div>
                        <div class="am-list-extra">
                            <Stepper
                                style={{ width: '100%', minWidth: '2rem' }}
                                showNumber max={activity.limitNum - activity.signNum} min={1} value={quantity}
                                onChange={this.onNumChange.bind(this)}
                                useTouch={false}
                            />
                        </div>
                    </div>
                    <InputItem
                        value={user.nickname}
                        editable={false}
                    >昵称</InputItem>
                    <InputItem
                        value={user.mobile}
                        editable={false}
                    >电话</InputItem>
                    <div class="pr">
                        <InputItem
                            {...getFieldProps('realName')}
                            placeholder="请输入姓名"
                        >姓名</InputItem>
                        {(realNameError = getFieldError('realName'))
                        ? <span class="comment-error-tip">{realNameError.join(',')}</span>
                        : null}
                    </div>
                </div>
                <div class="fix-bottom clearfix">
                    <div class="fl fix-b-left">合计：<span class="t_red">{Util.formatMoney(totalAmount)}</span>元</div>
                    <div class="fl fix-b-right" onClick={this.applyOrder.bind(this)}>确认报名</div>
                </div>
            </div>
        )
    }
}
export default createForm()(ApplyOrder);
