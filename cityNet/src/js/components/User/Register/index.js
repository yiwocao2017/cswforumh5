import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../NormalHeader';
import CityChoseList from '../../../containers/HeadLine/CityChoseList';
import AboutCSW from './AboutCSW';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Ajax = require('../../../util/ajax');
const Util = require('../../../util/util');
const IMUtil = require('../../IMChat/IMUtil');

class Register extends Component {
    constructor(){
        super();
        this.state = {
            company: null,
            showDropList: 0,
            captDisabled: false,
            captchaText: '获取验证码',
            showCSW: 0,                 //是否显示城市网服务协议
            CSWContent: ""              //城市网服务协议
        }
    }
    componentDidMount(){
        GeneralCtr.recordPageView();
    }
    // 获取当前站点
    componentWillMount(){
        this.setState({company: Util.getCompany()});
    }
    componentWillUnmount(){
        clearInterval(this.sendCaptcha.timer);
    }
    // 注册
    register(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                param.mobile = param.mobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                param.companyCode = this.state.company.code;
                Util.showLoading("注册中...");
                UserCtr.register(param)
                    .then(() =>  {
                        this.login(param.mobile, param.loginPwd);
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
    // 登录
    login(loginName, loginPwd){
        Util.showLoading("登录中...");
        UserCtr.login({
            loginName,
            loginPwd
        }).then((data) => {
            Util.setUser(data);
            Util.hideLoading();
            IMUtil.login(data.userId);
            Util.goBackAfterLogin();
        }).catch(() => {
            Util.historyBack();
        });
    }
    // 选中站点后更新state里的数据
    handleCityChoseClick(city){
        this.setState({
            company: city,
            showDropList: 0
        });
    }
    sendCaptcha(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields(["mobile"], (error, param) => {
            if(!error){
                let mobile = param.mobile.replace(/\s/ig, "");    //手机号间会有空格如：188 8888 8888
                GeneralCtr.sendCaptcha(mobile, "805076")
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

    // 点击选择站点按钮，并弹出城市列表
    clickChoseCityBtn(e){
        e.stopPropagation();
        e.preventDefault();
        Util.showLoading();
        // 获取城市列表
        UserCtr.getCompanyList()
            .then((data) => {
                Util.hideLoading();
                this.setState({
                    showDropList: 1,
                    cityListData: data
                });
            }).catch(()=>{});
    }
    // 关闭城市列表
    handleChoseCityCancel() {
        this.setState({showDropList: 0});
    }
    // 显示城市网服务协议
    showAboutCSW(e){
        e.stopPropagation();
        e.preventDefault();
        let {CSWContent} = this.state;
        if(!CSWContent){
            Util.showLoading();
            GeneralCtr.getSysConfig("cswRule")
                .then((data) => {
                    Util.hideLoading();
                    this.setState({
                        CSWContent: data.note,
                        showCSW: 1
                    });
                });
        }else{
            this.setState({showCSW: 1});
        }
    }
    // 隐藏城市网协议
    hideAboutCSW(){
        this.setState({showCSW: 0});
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let {
            showDropList,   //是否显示城市下拉列表
            captDisabled,   //验证码是否disabled
            captchaText,    //验证码上的文字
            company,        //当前选择的公司
            cityListData,   //城市列表数据
            showCSW,        //是否显示城市网服务协议
            CSWContent      //城市网服务协议内容
        } = this.state;

        let mobileError, smsCaptchaError, loginPwdError, rePwdError;

        return (
            <div>
                <NormalHeader title="注册"/>
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
                        <List.Item extra={
                            <Button onClick={this.sendCaptcha.bind(this)} disabled={captDisabled} type="primary" size="small" inline>{captchaText}</Button>
                        }>
                            <InputItem type="number" {...getFieldProps('smsCaptcha', {
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
                            <InputItem type="password" {...getFieldProps('loginPwd', {
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
                            {(loginPwdError = getFieldError('loginPwd'))
                                ? <span class="comment-error-tip">{loginPwdError.join(',')}</span>
                                : null}
                        </List.Item>
                        <List.Item>
                            <InputItem type="password" {...getFieldProps('rePwd', {
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }, {
                                    pattern: new RegExp(this.props.form.getFieldValue("loginPwd")),
                                    message: "两次密码不一致"
                                }]
                            })} placeholder="确认密码">
                                <div class="reg-item-password"/>
                            </InputItem>
                            {(rePwdError = getFieldError('rePwd'))
                                ? <span class="comment-error-tip">{rePwdError.join(',')}</span>
                                : null}
                        </List.Item>
                        <List.Item>
                            <div class="am-list-item am-input-item">
                                <div class="am-input-label am-input-label-5">
                                    <div class="reg-item-mask"></div>
                                </div>
                                <div onClick={this.clickChoseCityBtn.bind(this)} class="am-input-control">{company.name}</div>
                            </div>
                        </List.Item>
                    </List>

                    <div class="wp100 pt25 pb20 tc t_bbb fs13 lh120">注册成功后将生成一个登录名，格式为<samp class="t_red">CSW + 手机号</samp>您可以使用这个登录名进行登录</div>
                </div>
                <div class="plr10">
                    <input type="button" id="registerBtn" onClick={this.register.bind(this)} class="wp100 h50 bg_red t_white special-button" value="注册"/>
                </div>
                <div class="reg-b-tip tc t_bbb">注册即代表同意<samp class="t_red" onClick={this.showAboutCSW.bind(this)}>《城市网服务协议》</samp></div>
                {showDropList ? <CityChoseList cityListData={cityListData} handleCityChoseClick={this.handleCityChoseClick.bind(this)} handleChoseCityCancel={this.handleChoseCityCancel.bind(this)}/> : ""}
                {showCSW ? <AboutCSW content={CSWContent} goBack={this.hideAboutCSW.bind(this)}/> : ""}
            </div>
        );
    }
}
export default createForm()(Register);
