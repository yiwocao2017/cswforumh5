import React, {Component} from 'react';
import className from 'classnames';
import {Link} from 'react-router';
import './index.scss';
const serachIcon = require('../../../images/搜索@2x.png');
const forumIcon = require('../../../images/发帖@2x.png');
const Util = require('../../util/util');

export default class RichHeader extends Component {
    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/search');
    }
    componentWillMount() {
        const {activeNavIndex} = this.props;
        let title = activeNavIndex == 0 ? "有料" : "论坛";
        Util.setTitle(title);

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
    render() {
        const {
            activeNavIndex,
            pFixed
        } = this.props;
        let class0 = className({
            active: activeNavIndex == 0
        });
        let class1 = className({
            active: activeNavIndex == 1
        });
        let headerClass = className({
            richHeader: true,
            "p-fixed": pFixed
        });
        return (
            <header class={headerClass}>
                <div class="normal-back-wrap" onClick={this.handleClick.bind(this)}><img class="left" src={serachIcon} alt=""/></div>
                <div>
                    <Link to={`/rich`}><p class={class0}>有料</p></Link>
                    <Link to={`/block`}><p class={class1}>论坛</p></Link>
                </div>
                <div class="normal-right-wrap" onClick={this.goWritePost.bind(this)}><img class="right" src={forumIcon} alt=""/></div>
            </header>
        )
    }
}
