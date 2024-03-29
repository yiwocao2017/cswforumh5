import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../../components/NormalHeader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

class FindPwd extends Component {
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
    // 找回密码
    findPwd(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                param.mobile = param.mobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                Util.showLoading("设置中...");
                UserCtr.findPwd(param)
                    .then(() =>  {
                        Toast.success("密码设置成功, 请使用新密码进行登录", 1.2);
                        setTimeout(Util.historyBack, 1200);
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
        this.props.form.validateFields(["mobile"], (error, param) => {
            if(!error){
                let mobile = param.mobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                GeneralCtr.sendCaptcha(mobile, "805048")
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
        let mobileError, smsCaptchaError, newLoginPwdError, rePwdError;
        return (
            <div>
                <NormalHeader title="找回密码"/>
                <div class="p10 border-box">
                    <List class="register-wrap bg_fff">
                        <List.Item>
                            <InputItem type="phone" {...getFieldProps('mobile', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: /^1[3|4|5|7|8]\d\s\d{4}\s\d{4}$/,
                                    message: "格式错误"
                                }]
                            })} placeholder="请输入手机号码">
                                <div class="reg-item-user"/>
                            </InputItem>
                            {(mobileError = getFieldError('mobile'))
                                ? <span class="comment-error-tip">{mobileError.join(',')}</span>
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
                        <List.Item>
                            <InputItem type="password" {...getFieldProps('newLoginPwd', {
                                validateTrigger: 'onBlur',
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,16})$/,
                                    message: "密码须必为6~16位,同时包含数字和字母"
                                }]
                            })} placeholder="密码 (6~16)位，同时包含数字和字母">
                                <div class="reg-item-password"/>
                            </InputItem>
                            {(newLoginPwdError = getFieldError('newLoginPwd'))
                                ? <span class="comment-error-tip">{newLoginPwdError.join(',')}</span>
                                : null}
                        </List.Item>
                        <List.Item>
                            <InputItem type="password" {...getFieldProps('rePwd', {
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: new RegExp(this.props.form.getFieldValue("newLoginPwd")),
                                    message: "两次密码不一致"
                                }]
                            })} placeholder="确认密码">
                                <div class="reg-item-password"/>
                            </InputItem>
                            {(rePwdError = getFieldError('rePwd'))
                                ? <span class="comment-error-tip">{rePwdError.join(',')}</span>
                                : null}
                        </List.Item>
                    </List>
                </div>
                <div class="plr10 pt35">
                    <input type="button" id="findPwdBtn" onClick={this.findPwd.bind(this)} class="wp100 h50 bg_red t_white special-button" value="设置"/>
                </div>
            </div>
        );
    }
}
export default createForm()(FindPwd);
