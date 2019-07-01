// 签到
import React, {Component} from 'react';
import './index.scss';

const successIcon = require('../../../../images/signInSucc.png');
const errorIcon = require('../../../../images/signInErr.png');

export default class SignIn extends Component {
    // 隐藏签到界面
    hideSignIn(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.hideSignIn();
    }
    render() {
        let {isSignSuccess, amount} = this.props;   //  是否签到成功
        return (
            <div class="signin-wrap" onClick={this.hideSignIn.bind(this)}>
                {
                    isSignSuccess
                    ? (
                        <div>
                            <img class="successImg" src={successIcon}/>
                            {
                                amount == 0
                                ? ""
                                : <div class="sign-success-wrap">
                                    <div class="sign-success-text1">恭喜您今天获得了</div>
                                    <div class="sign-success-text2"><span class="t_red">{amount}</span>赏金</div>
                                </div>
                            }

                        </div>
                    )
                    : (
                        <img class="signErrorImg" src={errorIcon}/>
                    )
                }
            </div>
        )
    }
}
