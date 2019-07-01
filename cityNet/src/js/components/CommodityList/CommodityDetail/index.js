import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import {Button} from 'antd-mobile';
import NormalHeader from '../../NormalHeader';
import Swipe from '../../Swipe';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {MallCtr} from '../../../controller/MallCtr';
import {UserCtr} from '../../../controller/UserCtr';

import './index.scss';

const Util = require('../../../util/util');

export default class CommodityDetail extends Component {
    constructor(){
        super();
        this.state = {
            commodity: {},
            picData: [],
            address: ""
        };
        this.company = Util.getCompany();
    }
    componentDidMount(){
        Util.showLoading();
        this.getCommodityDetail()
            .then((data) => {
                if(data.companyCode != this.company.code){
                    this.getCompany(data.companyCode)
                        .then(Util.hideLoading).catch(() => {});
                }else{
                    let {province, city, area, address} = this.company;
                    if(province == city){
                        city = "";
                    }
                    this.setState({
                        address: province + city + area + address
                    });
                    Util.hideLoading();
                }
            }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 根据code获取company
    getCompany(code){
        return UserCtr.getCompanyByCode(code)
            .then((data) => {
                let {province, city, area, address} = data;
                if(province == city){
                    city = "";
                }
                this.setState({
                    address: province + city + area + address
                });
            });
    }
    // 获取商品详情
    getCommodityDetail(){
        return MallCtr.getCommodityDetail(this.props.params.code)
            .then((data) => {
                let pics = data.pic.split("||");
                let picArr = pics.map((pic, index) => (
                    { pic: pic }
                ));
                this.setState({
                    commodity: data,
                    picData: picArr
                });
                return data;
            });
    }
    handleClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.showLoading("下单中...");
        MallCtr.applyOrder(this.props.params.code)
            .then((data) => {
                Util.hideLoading();
                Util.goPath(`/pay/${data}`);
            }).catch(() => {});
    }
    render() {
        let {commodity, picData, address} = this.state;
        return (
            <div>
                <NormalHeader title={commodity.name || ""}/>
                <div className="sliderPic sliderPic1">
                    <Swipe data={picData}/>
                </div>
                <div class="wp100 mt10 bg_fff plr10 ptb10 border-box">
        			<div class="wp100 fs16 lh150">{commodity.name}</div>
                    {commodity.slogan ? <div class="wp100 commodity-slogan lh150">{commodity.slogan}</div> : ""}
        		</div>
                <div class="wp100 plr10 mt10 ptb10 fs14 bg_fff lh180 border-box t_999">
                    <span class="t_red pr2em">提示：</span>兑换的物品需要您自行提取。<br/>
                    <span class="t_red">兑换地址：</span>{address}
                </div>
                <div class="wp100 mt10"></div>
                <div class="commodityDetailBottom">
                    <span class="t_999">价格：</span>
                    {+commodity.price1 ? <span class="t_red">¥{Util.formatMoney(commodity.price1)}</span> : ""}
                    {+commodity.price2 && +commodity.price1 ? " + " : ""}
                    {+commodity.price2 ? <span class="t_red">{Util.formatMoney(commodity.price2)}赏金</span> : ""}

                    <Button inline type="small" onClick={this.handleClick.bind(this)} className="commodityDetailBuy">立即兑换</Button>
                </div>
            </div>
        );
    }
}
