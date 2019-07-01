import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem} from 'antd-mobile';
import NormalHeader from '../../NormalHeader';
import {createForm} from 'rc-form';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');
const IMUtil = require('../../IMChat/IMUtil');
const wechatIcon = require('../../../../images/wechat.png');

class Login extends Component {
    constructor(){
        super();
        this.state = {
            hidePage: true
        };
    }
    componentDidMount(){
        let {rUrl} = this.props.location.query;
        if(rUrl && Util.isOutPayLogin()){
            this.loginByWechat();
        }else{
            this.setState({
                hidePage: false
            });
        }
        GeneralCtr.recordPageView();
    }
    // 登录
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                Util.showLoading("登录中...");
                UserCtr.login(param)
                    .then((data) => {
                        Util.setUser(data);
                        Util.hideLoading();
                        IMUtil.login(data.userId);
                        let {rUrl} = this.props.location.query;
                        if(rUrl){
                            rUrl = decodeURIComponent(Util.getOutLoginUrl());
                            rUrl = rUrl.replace(/(comp=[^&#]+)(.*)/, '$1&tk='+ data.token +'$2');
                            Util.setOutLoginUrl(rUrl);
                            Util.goBackAfterOutLogin();
                        }else{
                            Util.goBackAfterLogin();
                        }
                    }).catch(() => {});
            }
        });
    }
    // 微信登录
    loginByWechat(e){
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }
        Util.showLoading();
        GeneralCtr.getAppId()
            .then((data) => {
                if(!data.length){
                    Toast.fail("appId获取失败", 1);
                }else{
                    Util.hideLoading();
                    let url = location.origin + '/#/user/redirect';
                    let {rUrl} = this.props.location.query;
                    if(rUrl){
                        url += `?rUrl=${rUrl}`;
                    }
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + data[0].password +
                            "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                }
            }).catch(() => {});
    }
    //跳到登录页面
    goRegister(e){
        e.preventDefault();
        e.stopPropagation();
        let {rUrl} = this.props.location.query;
        if(rUrl){
            Util.goPath(`/user/register?rUrl=${encodeURIComponent(rUrl)}`);
        }else{
            Util.goPath('/user/register');
        }
    }
    // 进入忘记密码页面
    goFindPwd(e){
        e.preventDefault();
        e.stopPropagation();
        let {rUrl} = this.props.location.query;
        if(rUrl){
            Util.goPath(`/user/findPwd?rUrl=${encodeURIComponent(rUrl)}`);
        }else{
            Util.goPath('/user/findPwd');
        }
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let loginPwdError, loginNameError;
        return (
            <div>
                {
                    this.state.hidePage ? null
                        : <div>
                            <NormalHeader title="登录"/>
                            <div class="p10 border-box">
                                <List class="register-wrap bg_fff">
                                    <List.Item>
                                        <InputItem {...getFieldProps('loginName', {
                                            rules: [{
                                                required: true,
                                                message: "不能为空"
                                            }]
                                        })} placeholder="请输入手机号码或用户名">
                                            <div class="reg-item-user"/>
                                        </InputItem>
                                        {(loginNameError = getFieldError('loginName'))
                                            ? <span class="comment-error-tip">{loginNameError.join(',')}</span>
                                            : null}
                                    </List.Item>
                                    <List.Item>
                                        <InputItem type="password" {...getFieldProps('loginPwd', {
                                            rules: [{
                                                required: true,
                                                message: "不能为空"
                                            }]
                                        })} placeholder="请输入密码">
                                            <div class="reg-item-password"/>
                                        </InputItem>
                                        {(loginPwdError = getFieldError('loginPwd'))
                                            ? <span class="comment-error-tip">{loginPwdError.join(',')}</span>
                                            : null}
                                    </List.Item>
                                </List>
                            </div>
                            <div class="plr10 pt35">
                                <input onClick={this.handleSubmit.bind(this)} type="button" class="wp100 h50 bg_red t_white special-button" value="登录"/>
                            </div>

                            <div class="reg-b-tip over-hide">
                                <div onClick={this.goRegister.bind(this)} class="fl t_red">去注册</div>
                                <div onClick={this.goFindPwd.bind(this)} class="fr t_bbb">找回密码?</div>
                            </div>

                            <div class="wp100 pt150">
                                <div class="tc b_bd_b pr"><p class="wp100 otherLogin tc"><samp class="bg_f0 inline_block plr10">其它登录方式</samp></p></div>
                                <a onClick={this.loginByWechat.bind(this)} class="tc inline_block wp100 pt35"><img class="h50" src={wechatIcon}/></a>
                            </div>
                        </div>
                }
            </div>
        );
    }
}
export default createForm()(Login);
