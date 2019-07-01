import React, {Component} from 'react';
import className from 'classnames';
import {Link} from 'react-router';
import './index.scss';

const Util = require('../../../../util/util');
const backIcon = require('../../../../../images/返回@2x.png');

export default class MentionListHeader extends Component {
    goBack(e){
        e.stopPropagation();
        e.preventDefault();
        Util.goPath('/user/message');
    }
    componentWillMount(){
        Util.setTitle(this.props.pageTitle);
    }
    render() {
        const {activeNavIndex} = this.props;
        let class0 = className({
            active: activeNavIndex == 1
        });
        let class1 = className({
            active: activeNavIndex == 2
        });

        return (
            <header class="commentListHeader">
                <div class="normal-back-wrap" onClick={this.goBack.bind(this)}><img class="goback" src={backIcon} alt=""/></div>
                <div>
                    <Link to={`/user/mention/list/1`}><p class={class0}>帖子</p></Link>
                    <Link to={`/user/mention/list/2`}><p class={class1}>评论</p></Link>
                </div>
            </header>
        )
    }
}
