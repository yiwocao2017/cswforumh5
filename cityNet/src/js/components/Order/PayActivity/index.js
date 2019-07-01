import React, {Component} from 'react';
import './index.scss';
import className from 'classnames';
import NormalHeader from '../../NormalHeader';
import {ActivityCtr} from '../../../controller/ActivityCtr';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import { List, Toast, Button, Modal } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

const Util = require('../../../util/util');

const successIcon = require('../../../../images/pay-suc.png');
const wechatIcon = require('../../../../images/wechat1.png');

export default class PayActivity extends Component {
    constructor(){
        super();
        this.state = {
            order: null,
            success: 0
        };
        this.resp = null;
    }
    componentDidMount(){
        Util.showLoading();
        this.getOrderDetail().then(Util.hideLoading).catch(() => {});
    }
    componentWillUnmount(){
        if (document.addEventListener) {
            document.removeEventListener("WeixinJSBridgeReady", this.onBridgeReady.bind(this));
        } else if (document.attachEvent) {
            document.detachEvent('WeixinJSBridgeReady', this.onBridgeReady.bind(this));
            document.detachEvent('onWeixinJSBridgeReady', this.onBridgeReady.bind(this));
        }
    }
    // 获取订单详情
    getOrderDetail(){
        return ActivityCtr.getOrder(this.props.params.code)
            .then((order) => this.setState({order}));
    }
    // 支付订单
    payOrder(e){
        e.stopPropagation();
        e.preventDefault();
        Util.showLoading("支付中...");
        ActivityCtr.payOrder(this.props.params.code)
        .then((data) => {
            this.wxPay(data);
        }).catch((msg) => {
            if(msg == "请先绑定微信"){
                Toast.hide();
                Modal.alert('提示', '请先进行微信登录，并关联手机号后，才可以进行微信支付?', [
                    { text: '取消', onPress: () => {} },
                    { text: '确定', onPress: () => {
                        this.goLogin();
                        // Util.goLogin(true);
                    } }
                ]);
            }
        });
    }
    goLogin(){
        sessionStorage.removeItem("return");
        sessionStorage.removeItem("isback");
        let _hash = location.hash.substr(1).replace(/\?.*/i, "");
        sessionStorage.setItem("return", _hash);
        sessionStorage.setItem("isback", 1);
        Util.showLoading();
        GeneralCtr.getAppId()
            .then((data) => {
                if(!data.length){
                    Toast.fail("appId获取失败", 1);
                }else{
                    Util.hideLoading();
                    let url = location.origin + '/#/user/redirect';
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + data[0].password +
                            "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                }
            }).catch(() => {});
    }
    // 微信支付触发事件
    onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": this.resp.appId, //公众号名称，由商户传入
                "timeStamp": this.resp.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": this.resp.nonceStr, //随机串
                "package": this.resp.wechatPackage,
                "signType": this.resp.signType, //微信签名方式：
                "paySign": this.resp.paySign //微信签名
            },
            (res) => {
                Util.hideLoading();
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    this.setState({success: 1})
                } else if(res.err_msg == "get_brand_wcpay_request:fail") {
                    Toast.fail("支付失败", 1.5);
                }
            }
        );
    }
    // 添加微信支付事件
    wxPay(data) {
        this.resp = data;
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.removeEventListener("WeixinJSBridgeReady", this.onBridgeReady.bind(this));
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady.bind(this), false);
            } else if (document.attachEvent) {
                document.detachEvent('WeixinJSBridgeReady', this.onBridgeReady.bind(this));
                document.detachEvent('onWeixinJSBridgeReady', this.onBridgeReady.bind(this));
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady.bind(this));
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady.bind(this));
            }
        } else {
            this.onBridgeReady();
        }
    }
    goHome(e){
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/home');
    }
    goBack(){
        let {order} = this.state;
        if(sessionStorage.getItem("isback")){
            Util.goPath(`/activity/${order.productCode}`);
        }else{
            Util.historyBack();
        }
    }
    render(){
        let {order, success} = this.state;
        let wechatClass = className({
            "circle-icon": 1,
            "active": 1
        });
        return (
            <div class="pay-wrap box">
                <NormalHeader goBack={this.goBack.bind(this)} fixed={true} title="支付"/>
                <div style={{"height": "0.88rem"}}></div>
                {
                    success
                    ? <div class="pay-success-cont">
                        <img src={successIcon} />
                        <div class="pay-suc-title1">您已报名成功</div>
                        <div class="pay-suc-title2">成功支付<span class="t_red">{Util.formatMoney(order && order.totalAmount || 0)}</span>元</div>
                        <div class="pay-success-btns clearfix">
                            <Button onClick={this.goHome.bind(this)} type="ghost" inline size="small">返回首页</Button>
                        </div>
                    </div>
                    : <div>
                        <List renderHeader={() => '支付方式'}>
                            <Item
                             thumb={wechatIcon}
                             extra={<div class={wechatClass}></div>}
                           >微信支付</Item>
                        </List>
                        <div class="fix-bottom clearfix">
                            <div class="fl fix-b-left">合计：<span class="t_red">{Util.formatMoney(order && order.totalAmount || 0)}</span>元</div>
                            <div class="fl fix-b-right" onClick={this.payOrder.bind(this)}>确认付费</div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}
