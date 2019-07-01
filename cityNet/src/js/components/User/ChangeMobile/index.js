import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../NormalHeader';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

class ChangeMobile extends Component {
    constructor(){
        super();
        this.state = {
            captDisabled: false,
            captchaText: '获取验证码'
        }
    }
    componentDidMount(){
        GeneralCtr.recordPageView();
    }
    componentWillUnmount(){
        clearInterval(this.sendCaptcha.timer);
    }
    // 修改手机号
    changeMobile(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                param.newMobile = param.newMobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                Util.showLoading("修改中...");
                UserCtr.changeMobile(param)
                    .then(() =>  {
                        globalInfo.user.mobile = param.newMobile;
                        Toast.success("手机号修改成功", 1);
                        setTimeout(Util.historyBack, 1e3);
                    }).catch(() => {
                        clearInterval(this.sendCaptcha.timer);
                        this.setState({
                            captchaText: "获取验证码",
                            captDisabled: false
                        });
                    });
            }
        });
    }
    // 发送验证码
    sendCaptcha(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields(["newMobile"], (error, param) => {
            if(!error){
                let mobile = param.newMobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                GeneralCtr.sendCaptcha(mobile, "805047")
                    .then((data) => {
                        this.setState({
                            captDisabled: true,
                            captchaText: '60s'
                        });
                        let i = 60;
                        this.sendCaptcha.timer = setInterval(() => {
                            this.setState({
                                captchaText: (i--) + "s"
                            });
                            if(i <= 0){
                                clearInterval(this.sendCaptcha.timer);
                                this.setState({
                                    captchaText: "获取验证码",
                                    captDisabled: false
                                });
                            }
                        }, 1e3);
                    })
                    .catch(()=>{});
            }
        });
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let {captchaText, captDisabled} = this.state;
        let newMobileError, smsCaptchaError;
        return (
            <div>
                <NormalHeader title="修改手机号"/>
                {/* <div style={{
                    "height": "0.88rem"
                }}></div> */}
                <div class="p10 border-box">
                    <List class="register-wrap bg_fff">
                        <List.Item>
                            <InputItem type="phone" {...getFieldProps('newMobile', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: /^1[3|4|5|7|8]\d\s\d{4}\s\d{4}$/,
                                    message: "格式错误"
                                }]
                            })} placeholder="请输入新手机号码">
                                <div class="reg-item-user"/>
                            </InputItem>
                            {(newMobileError = getFieldError('newMobile'))
                                ? <span class="comment-error-tip">{newMobileError.join(',')}</span>
                                : null}
                        </List.Item>
                        <List.Item extra={<Button onClick={this.sendCaptcha.bind(this)} disabled={captDisabled} type="primary" size="small" inline>{captchaText}</Button>}>
                            <InputItem {...getFieldProps('smsCaptcha', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: /^\d{4}$/,
                                    message: "格式错误"
                                }]
                            })} placeholder="请输入验证码">
                                <div class="reg-item-captcha"/>
                            </InputItem>
                            {(smsCaptchaError = getFieldError('smsCaptcha'))
                                ? <span class="comment-error-tip comment-error-tip-btn">{smsCaptchaError.join(',')}</span>
                                : null}
                        </List.Item>
                    </List>
                </div>
                <div class="plr10 pt35">
                    <input type="button" id="changeMobileBtn" onClick={this.changeMobile.bind(this)} class="wp100 h50 bg_red t_white special-button" value="修改"/>
                </div>
            </div>
        );
    }
}
export default createForm()(ChangeMobile);
