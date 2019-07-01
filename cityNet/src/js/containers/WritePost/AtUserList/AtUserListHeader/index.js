import React, {Component} from 'react';
import className from 'classnames';
import './index.scss';

const Util = require('../../../../util/util.js');

export default class AtUserListHeader extends Component {
    // 关闭联系人列表
    handleUserClose(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleUserClose();
    }
    render(){
        return (
            <header class="at-userlist-header">
                <div onClick={this.handleUserClose.bind(this)} class="goback">关闭</div>联系人
            </header>
        );
    }
}
