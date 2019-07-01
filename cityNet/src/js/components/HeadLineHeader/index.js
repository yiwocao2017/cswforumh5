import React, {Component} from 'react';
import './index.scss';

const serachIcon = require('../../../images/搜索@2x.png');
const locationIcon = require('../../../images/定位选择@2x.png');
const forumIcon = require('../../../images/发帖@2x.png');
const Util = require('../../util/util');

export default class HeadLineHeader extends Component {
    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/search');
    }
    componentWillMount() {
        Util.setTitle(this.props.pageTitle);
    }
    goWritePost(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!Util.isLogin()) {
            Util.goLogin();
            return;
        }
        Util.goPath('/write');
    }
    handleDropClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleDropClick();
    }

    render() {
        const {
            title
        } = this.props;
        return (
            <header class="headerLineHeader">
                <div class="normal-back-wrap" onClick={this.handleClick.bind(this)}><img class="left" src={serachIcon} alt=""/></div>
                <div class="head-drop-wrap" onClick={this.handleDropClick.bind(this)}><span>{title}</span> <img src={locationIcon} alt="下拉"/></div>
                <div class="normal-right-wrap" onClick={this.goWritePost.bind(this)}><img class="right" src={forumIcon} alt=""/></div>
            </header>
        )
    }
}
