import React, {Component} from 'react'
import {Carousel} from 'antd-mobile';
import './index.scss';

const Util = require('../../util/util.js');

export default class ActivitySwipe extends Component {
    constructor(){
        super();
        this.state = {
            initialHeight: 200
        }
    }
    getSwiperItem(item, hProp, key="") {
        return (
            <div key={key} style={hProp}>
                <img
                    src={Util.formatImg(item)}
                    onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({
                          initialHeight: null,
                        });
                    }}
                />
            </div>
        );
    }
    render() {
        let {data} = this.props;
        /*如果接收到一张图片就单纯展示，如果是多张，就用Carousel组件展示*/
        let list;
        data = data && data.split("||") || [];
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        if (data.length <= 1) {
            list = <Carousel>
                    {this.getSwiperItem(data[0], hProp)}
                   </Carousel>
        } else {
            list = <Carousel autoplay={true} infinite={true} dots={true}>
                    {data.map((item, index) => (this.getSwiperItem(item, hProp, `${index}`)))}
                   </Carousel>
        }
        return list;
    }
}
