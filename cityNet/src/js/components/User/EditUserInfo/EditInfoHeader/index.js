import React, {Component} from 'react';
import './index.scss';

const Util = require('../../../../util/util.js');
const backIcon = require('../../../../../images/返回@2x.png');

export default class EditInfoHeader extends Component {
    componentWillMount(){
        Util.setTitle(this.props.title);
    }
    // 返回
    handleGoBack(e){
        e.stopPropagation();
        e.preventDefault();
        Util.historyBack();
    }
    // 保存
    saveInfo(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.saveInfo();
    }
    render(){
        let {title} = this.props;
        return (
            <header class="editinfo-header">
                <div class="normal-back-wrap" onClick={this.handleGoBack.bind(this)}><img class="goback" src={backIcon} alt=""/></div>{title}
                <div onClick={this.saveInfo.bind(this)} class="head-right">保存</div>
            </header>
        );
    }
}
