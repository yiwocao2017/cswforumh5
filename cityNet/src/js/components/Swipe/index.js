import React, {Component} from 'react'
import {Carousel} from 'antd-mobile';
import {Link} from 'react-router';
import './index.scss';

const Util = require('../../util/util');

export default class Swipe extends Component {
    isOutUrl(url) {
        if (/^(?:http:\/\/)|(?:https:\/\/)/.test(url)) {
            return true;
        } else {
            return false;
        }
    }
    getSwiperItem(item, key="") {
        let swiper;
        if(item.url){
            let result = Util.parseSubSystemUrl(item.url);
            if(result.outUrl){
                swiper = (
                    <a href={result.url} key={key}>
                        <img src={Util.formatImg(item.pic)} className="img-responsive"/>
                        {item.name ? <div class="swipe-item-bottom">{item.name}</div> : ""}
                    </a>
                )
            }else{
                swiper = (
                    <Link to={result.url} key={key}>
                        <img src={Util.formatImg(item.pic)} className="img-responsive"/>
                        {item.name ? <div class="swipe-item-bottom">{item.name}</div> : ""}
                    </Link>
                )
            }
        }else{
            swiper = (
                <div key={key}>
                    <img src={Util.formatImg(item.pic)} className="img-responsive"/>
                    {item.name ? <div class="swipe-item-bottom">{item.name}</div> : ""}
                </div>
            )
        }
        return swiper;
    }
    render() {
        const {data} = this.props;
        /*如果接收到一张图片就单纯展示，如果是多张，就用Carousel组件展示*/
        let list;
        if (data.length === 1) {
            list = <Carousel dots={true}>
                    {this.getSwiperItem(data[0])}
                   </Carousel>
        } else {
            list = <Carousel autoplay={true} infinite={true} dots={true}>
                {data.map((item, index) => (this.getSwiperItem(item, `index${index}`)))}
            </Carousel>
        }
        return (
            <div class="index-banner">
                {list}
            </div>
        )
    }
}
