import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Button} from 'antd-mobile';
import Carousel from 'nuka-carousel';
import className from 'classnames';

import './index.scss';

const Util = require('../../util/util');

export default class ShowPic extends Component{
    constructor() {
        super();
        this.state = {
            slideIndex: 0,
            lineHeight: ""
        };
    }
    componentWillMount() {
        // 设置当前浏览的图片下标
        this.setState({slideIndex : this.props.slideIndex});
    }
    componentDidMount(){
        // 获取当前容器的高度
        this.setState({lineHeight: findDOMNode(this.refs.carousel).scrollHeight});
    }
    // 图片切换事件
    _onChange(newSlide) {
        this.setState({slideIndex: newSlide});
    }
    // 上一张
    _prevSlide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.carousel.goToSlide(this.state.slideIndex - 1);
    }
    // 下一张
    _nextSlide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.carousel.goToSlide(this.state.slideIndex + 1);
    }
    // 图片点击,隐藏图片展示框
    _picClick(e){
        // 防止点击事件触发帖子的点击事件，导致进入详情页面
        e.preventDefault();
        e.stopPropagation();
        this.props.hideCarousel();
    }
    // 图片触摸事件
    _touchStart(e){
        this.startTime = new Date().getTime();
        this.startPos = {
            x: e.targetTouches[0].pageX,
            y: e.targetTouches[0].pageY
        };
        this.endPos = null;
    }
    // 图片触摸事件
    _touchMove(e){
        this.endPos = {
            x: e.targetTouches[0].pageX,
            y: e.targetTouches[0].pageY
        };
    }
    // 图片触摸事件
    _touchEnd(e){
        e.preventDefault();
        this.endTime = new Date().getTime();
        let useTime = this.endTime - this.startTime;
        if((!this.endPos || this._calDistance(this.startPos, this.endPos) < 10) && useTime < 400){
            this.props.hideCarousel();
        }
    }
    // 图片触摸结束时，手指移动的距离
    _calDistance(start, end){
        let x = end.x - start.x,
            y = end.y - start.y;
        let distance = x*x + y*y;
        return distance;
    }
    _closePic(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.hideCarousel();
    }
    handleImgLoad(e){
        e.target.className = "banner-pic";
    }
    render() {
        // 设置行高，使图片垂直居中
        let cssParam = {
            "lineHeight": this.state.lineHeight + "px"
        };
        let {carouselData, slideIndex} = this.props;
        let {"slideIndex": current} = this.state;
        let Decorators = [
            {
                component: React.createClass({
                    render() {
                        let slideCount = this.props.slideCount,
                            slidesToScroll = this.props.slidesToScroll;
                        let arr = [];
                        for (let i = 0; i < slideCount; i += slidesToScroll) {
                            arr.push(i);
                        }
                        return (
                            <div class="am-carousel-wrap">
                                {arr.map(function(index) {
                                    return <div key={`index${index}`} class={className({
                                        "am-carousel-wrap-dot": true,
                                        "am-carousel-wrap-dot-active": index == current
                                    })}>
                                        <span></span>
                                    </div>
                                })}
                            </div>
                        )
                    }
                }),
                position: 'BottomCenter',
                style: {
                    padding: 20
                }
            }
        ];
        return (
            <div ref="carouselWrap" class="show-pics-carousel-wrap">
                <div class="carousel-close-btn" onClick={this._closePic.bind(this)}><img src={require('../../../images/close-icon.png')} /></div>
                <Carousel
                    decorators={Decorators} ref="carousel" afterSlide={this._onChange.bind(this)} class="show-pics-carousel" slideIndex={slideIndex}>
                    {carouselData && carouselData.length && carouselData.map((imgUrl, index) => (
                        <div class="carousel-item-img-wrap"
                            style={cssParam}
                            key={`index${index}`}
                            onTouchStart={this._touchStart.bind(this)}
                            onTouchMove={this._touchMove.bind(this)}
                            onTouchEnd={this._touchEnd.bind(this)}
                            >
                            <div class="show-pics-item global-loading-icon"></div>
                            <img class="banner-pic hidden" src={Util.formatImg(imgUrl)} onLoad={this.handleImgLoad.bind(this)}/>
                        </div>
                    ))}
                </Carousel>
                <div class="show-pics-carousel-bottom">
                    {current != 0
                        && <Button onClick={this._prevSlide.bind(this)} className="carousel-bottom-left carousel-bottom-btn" size="small" type="ghost" inline>上一张</Button>}
                    {current + 1 < carouselData.length
                        && <Button onClick={this._nextSlide.bind(this)} className="carousel-bottom-right carousel-bottom-btn" size="small" type="ghost" inline>下一张</Button>}
                </div>
            </div>
        )
    }
}
