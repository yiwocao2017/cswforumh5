import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import {ActivityIndicator} from 'antd-mobile';
import './index.scss';

const Util = require('../../../util/util');

export default class CommodityItem extends Component {
    
    render() {
        let {commodity} = this.props;
        return (
            <li class="plr5 wp50 mtb5 fl border-box">
                <Link to={`/mall/detail/${commodity.code}`} class="wp100 inline_block over-hide">
                    <div class="wp100 h130 over-hide border-box"><img class="wp100 hp100" src={Util.formatMallListImg(commodity.advPic)}/></div>
                    <div class="wp100 p10 commodity-title t_es">{commodity.name}</div>
                    <div class="wp100 commodity-cont t_es">价格：
                        {+commodity.price1 ? <span class="commodity-price">¥{Util.formatMoney(commodity.price1)}</span> : ""}
                        {+commodity.price2 && +commodity.price1 ? " + " : ""}
                        {+commodity.price2 ? <span class="commodity-price">{Util.formatMoney(commodity.price2)}赏金</span> : ""}
                    </div>
                </Link>
            </li>
        );
    }
}
