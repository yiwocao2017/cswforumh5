import React, {Component} from 'react';
import './index.scss';

const backIcon = require('../../../../images/返回@2x.png');
const locationIcon = require('../../../../images/定位选择@2x.png');
const Util = require('../../../util/util');

export default class WritePostHeader extends Component {
    componentWillMount(){
        Util.setTitle('发帖');
    }
    handleClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleClose();
    }
    // 发布帖子
    handleSubmit(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleSubmit();
    }
    // 点击选择板块
    handleChoseClick(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleChoseClick();
    }
    render() {
        let {title} = this.props;
        return (
            <header class="headerLineHeader1">
                <div class="normal-back-wrap" onClick={this.handleClose.bind(this)}><img class="goback" src={backIcon} alt=""/></div>
                <div class="inline_block" onClick={this.handleChoseClick.bind(this)}><span>{title || "选择板块"}</span> <img src={locationIcon} alt="下拉"/></div>
                <div class="right-apply" onClick={this.handleSubmit.bind(this)}>发布</div>
            </header>
        )
    }
}
