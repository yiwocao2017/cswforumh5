import React, {Component} from 'react';
import './index.scss';
import className from 'classnames';
import NormalHeader from '../NormalHeader';
import { List, Button, Toast } from 'antd-mobile';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {MallCtr} from '../../controller/MallCtr';
import {UserCtr} from '../../controller/UserCtr';

const Item = List.Item;
const Brief = Item.Brief;

const Util = require('../../util/util');

const wechatIcon = require('../../../images/wechat.png');
const remainIcon = require('../../../images/remain.png');

export default class Pay extends Component {
    constructor(){
        super();
        this.state = {
            index: 1,
            price1: 0,
            price3: 0,
            accountReamin: 0
        };
    }
    componentDidMount(){
        Util.showLoading();
        Promise.all([
            this.getAccount(),
            this.getOrderDetail()
        ]).then(Util.hideLoading).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 获取账户详情
    getAccount(){
        return UserCtr.getAccount(true)
            .then((data) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].currency == "JF"){
                        this.setState({
                            accountReamin: data[i].amount
                        });
                        break;
                    }
                }
            });
    }
    // 获取订单详情
    getOrderDetail(){
        return MallCtr.getOrderDetail(this.props.params.code, true)
            .then((data) => {
                if(data.status != "1"){
                    Toast.info("该订单不处于带支付状态", 1);
                    setTimeout(() => Util.goPath('/user'), 1e3);
                    return;
                }
                this.setState({
                    price1: data.amount1 || 0,
                    price3: data.amount3 || 0
                });
            });
    }
    // 支付方式修改
    handleChange(index, e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({index});
    }
    handleClick(e){
        e.stopPropagation();
        e.preventDefault();
        let {index} = this.state;
        let payType = 90;
        this.payOrder(index, payType);
    }
    // 支付订单
    payOrder(index, payType){
        Util.showLoading("支付中...");
        MallCtr.payOrder([this.props.params.code], payType)
            .then((data) => {
                Toast.success("支付成功！", 1);
                setTimeout(() => {
                    Util.goPath('/user');
                }, 1e3);
            }).catch(() => {});
    }
    render(){
        let {
            index,          //当前选择的支付方式
            price1,         //商品rmb价格
            price3,         //商品赏金价格
            accountReamin   //赏金余额
        } = this.state;
        let wechatClass = className({
            "circle-icon": true,
            "active": index == 0
        });
        let remainClass = className({
            "circle-icon": true,
            "active": index == 1
        });
        return (
            <div class="pay-wrap box">
                <NormalHeader title="支付"/>
                <List renderHeader={() => '商品金额'}>
                    {price1 ? <Item extra={`¥${Util.formatMoney(price1)}`}>RMB</Item> : ""}
                    {price3 ? <Item extra={Util.formatMoney(price3)}>赏金</Item> : ""}
                </List>
                <List renderHeader={() => '支付方式'}>
                    {/* <Item
                     thumb={wechatIcon}
                     extra={<div class={wechatClass}></div>}
                     onClick={this.handleChange.bind(this, 0)}
                   >微信支付<Brief>副标题</Brief></Item> */}
                   <Item
                    thumb={remainIcon}
                    extra={<div class={remainClass}></div>}
                    onClick={this.handleChange.bind(this, 1)}
                  >赏金余额支付<Brief>余额：{Util.formatMoney(accountReamin)}</Brief></Item>
                </List>
                {/* <List renderHeader={() => '账户余额'}>
                    <Item extra={Util.formatMoney(accountReamin)}>赏金</Item>
                </List> */}
                <div class="bottom-button"><Button onClick={this.handleClick.bind(this)} type="primary">支付</Button></div>
            </div>
        );
    }
}
