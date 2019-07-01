import React, {Component} from 'react';
import {List, InputItem, Toast, Button} from 'antd-mobile';
import NormalHeader from '../../../NormalHeader';
import {createForm} from 'rc-form';
import {globalInfo} from '../../../../containers/App';
import {GeneralCtr} from '../../../../controller/GeneralCtr';
import {UserCtr} from '../../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../../util/util');
const IMUtil = require('../../../IMChat/IMUtil');

class Redirect extends Component {
    constructor() {
        super();
        this.state = {
            showMobile: 0,
            title: "微信登录",
            captDisabled: false,
            captchaText: '获取验证码'
        };
    }
    componentDidMount() {
        Util.showLoading();
        this.getWXLoginParam();
    }
    getWXLoginParam(){
        let {code, mobile, sms} = this.props.location.query;
        let params = {
            code,
            mobile: mobile || "",
            smsCaptcha: sms || "",
            companyCode: Util.getCompany().code,
            isRegHx: 1
        }
        if(!mobile && Util.isLogin()){
            params.isLoginCaptcha = 1;
            if(!globalInfo.user.mobile){
                UserCtr.getUserInfo()
                    .then((data) => {
                        globalInfo.user = data;
                        params.mobile = globalInfo.user.mobile;
                        this.wxLogin(params);
                    }).catch(() => {
                        this.wxLogin(params);
                    });
            }else{
                params.mobile = globalInfo.user.mobile;
                this.wxLogin(params);
            }
        }else{
            this.wxLogin(params);
        }
    }
    // 微信登录
    wxLogin(params) {
        UserCtr.wxLogin(params)
            .then((data) => {
                if (data.isNeedMobile == "1") {
                    Toast.info("微信登录需要先绑定手机号", 1);
                    this.setState({
                        showMobile: 1,
                        title: "绑定手机号"
                    });
                } else {
                    let {rUrl} = this.props.location.query;
                    Util.setUser(data);
                    IMUtil.login(data.userId);
                    if (rUrl) {
                        globalInfo.user = data;
                        Util.hideLoading();
                        rUrl = decodeURIComponent(Util.getOutLoginUrl());
                        rUrl = rUrl.replace(/(comp=[^&#]+)(.*)/, '$1&tk=' + data.token + '$2');
                        Util.setOutLoginUrl(rUrl);
                        Util.goBackAfterOutLogin();
                    } else {
                        UserCtr.getUserInfo()
                            .then((data) => {
                                globalInfo.user = data;
                                Util.hideLoading();
                                Util.goBackAfterLogin();
                            }).catch(() => {
                                Util.hideLoading();
                                Util.goBackAfterLogin();
                            });
                    }
                }

            }).catch((data) => {});
    }
    // 发送验证码
    sendCaptcha(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields(["mobile"], (error, param) => {
            if (!error) {
                this.setState({
                    captDisabled: true
                });
                let mobile = param.mobile.replace(/\s/ig, ""); //手机号间会有空格如：188 8888 8888
                GeneralCtr.sendCaptcha(mobile, "805151")
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
                            if (i <= 0) {
                                clearInterval(this.sendCaptcha.timer);
                                this.setState({
                                    captchaText: "获取验证码",
                                    captDisabled: false
                                });
                            }
                        }, 1e3);
                    })
                    .catch(() => {
                        this.setState({
                            captDisabled: false
                        });
                    });
            }
        });
    }
    // 填好手机号后点击提交按钮
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if (!error) {
                param.mobile = param.mobile.replace(/\s/ig, "");
                Util.showLoading();
                GeneralCtr.getAppId()
                    .then((data) => {
                        if (!data.length) {
                            Toast.fail("appId获取失败", 1);
                        } else {
                            let {rUrl} = this.props.location.query;
                            if (rUrl) {
                                rUrl = `&rUrl=${rUrl}`;
                            } else {
                                rUrl = '';
                            }
                            let redirect_uri = encodeURIComponent(location.origin + `?mobile=${param.mobile}&sms=${param.smsCaptcha}${rUrl}/#/user/redirect`);
                            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + data[0].password +
                                "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                        }
                    }).catch(() => {});
            }
        });
    }
    render() {
        let {
            getFieldProps,
            getFieldError
        } = this.props.form;
        let {
            showMobile,
            title,
            captDisabled,
            captchaText
        } = this.state;
        let mobileError, smsCaptchaError;
        return (
            <div>

                {showMobile
                    ?
                    <div>
                        <NormalHeader title={title}/>
                        <div class="p10 border-box">
                            <List renderHeader={() => (<span class="t_red">微信登录需要先填写手机号</span>)} class="register-wrap bg_fff">
                                <List.Item>
                                    <InputItem type="phone" {...getFieldProps('mobile', {
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
                            </List>
                            <div class="plr10 pt35">
                                <input onClick={this.handleSubmit.bind(this)} type="button" class="wp100 h50 bg_red t_white special-button" value="登录"/>
                            </div>
                        </div>
                    </div>
                    : ""
                }
            </div>
        );
    }
}
export default createForm()(Redirect);
