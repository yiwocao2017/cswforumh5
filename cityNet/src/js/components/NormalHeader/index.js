import React, {Component} from 'react';
import className from 'classnames';
import './index.scss';

const Util = require('../../util/util.js');
const backIcon = require('../../../images/返回@2x.png');

export default class NormalHeader extends Component {
    handleIconClick(e){
        e.preventDefault();
        e.stopPropagation();
        const {handleClick} = this.props;
        if(handleClick)
            handleClick();
    }
    handleBack(e){
        e.preventDefault();
        e.stopPropagation();
        const {goBack} = this.props;
        if(goBack)
            goBack();
        else
            Util.historyBack();
    }
    componentWillMount(){
        if (!this.props.unset)
            Util.setTitle(this.props.title);
    }
    render(){
        let {hideBack, title, rightIcon, fixed} = this.props;
        let goBackClass = className({
            "normal-back-wrap": true,
            hidden: hideBack
        });
        let headClass = className({
            'normal-header': true,
            'p-fixed': fixed
        });
        return (
            <header class={headClass}>
                <div class={goBackClass} onClick={this.handleBack.bind(this)}><img class="goback" src={backIcon} alt=""/></div>
                <div class="normal-header-title">{title}</div>
                {
                    rightIcon ? <div class="normal-right-wrap" onClick={this.handleIconClick.bind(this)}>
                        <img src={rightIcon} class="head-right-icon"/></div> : ""
                }
            </header>
        );
    }
}
