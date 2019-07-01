import React, {Component} from 'react';
import {ActivityIndicator} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import './index.scss';

const backIcon = require('../../../../images/返回@2x.png');
const searchIcon = require('../../../../images/搜索@2x.png');
const wirteIcon = require('../../../../images/发帖@2x.png');
const Util = require('../../../util/util');

export default class ForumBlockHeader extends Component {

    goWrite(e){
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.goPath('/write?bankcode='+ this.props.code);
    }
    handleBack(e){
        e.preventDefault();
        e.stopPropagation();
        Util.historyBack();
    }
    goSearch(e){
        e.preventDefault();
        e.stopPropagation();
        Util.goPath('/search');
    }

    render(){
        return (
            <header class="modellistHeader">
                <div class="normal-back-wrap" onClick={this.handleBack.bind(this)}><img class="goback" src={backIcon} alt=""/></div>
                <div class="normal-right-wrap1" onClick={this.goSearch.bind(this)}><img class="search" src={searchIcon} alt=""/></div>
                <div class="normal-right-wrap" onClick={this.goWrite.bind(this)}><img class="write" src={wirteIcon} alt=""/></div>
                {this.props.title}
            </header>
        );
    }
}
