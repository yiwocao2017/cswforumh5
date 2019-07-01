import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../../components/NormalHeader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

class ResetPwd extends Component {
    resetPwd(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                Util.showLoading("修改中...");
                UserCtr.resetPwd(param)
                    .then((data) => {
                        Util.hideLoading();
                        Toast.success("修改密码成功");
                        setTimeout(Util.historyBack, 1e3);
                    }).catch(() => {});
            }
        });
    }
    componentDidMount(){
        GeneralCtr.recordPageView();
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let oldLoginPwdError, newLoginPwdError, rePasswordError;
        return (
            <div>
                <NormalHeader title="修改密码"/>
                <div class="p10 border-box">
                    <List class="register-wrap bg_fff">
                        <List.Item>
                            <InputItem type="password" {...getFieldProps('oldLoginPwd', {
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }]
                            })} placeholder="原密码">
                                <div class="reg-item-password"/>
                            </InputItem>
                            {(oldLoginPwdError = getFieldError('oldLoginPwd'))
                                ? <span class="comment-error-tip">{oldLoginPwdError.join(',')}</span>
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
                            })} placeholder="新密码 (6~16)位，同时包含数字和字母">
                                <div class="reg-item-password"/>
                            </InputItem>
                            {(newLoginPwdError = getFieldError('newLoginPwd'))
                                ? <span class="comment-error-tip">{newLoginPwdError.join(',')}</span>
                                : null}
                        </List.Item>
                        <List.Item>
                            <InputItem type="password" {...getFieldProps('rePassword', {
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
                            {(rePasswordError = getFieldError('rePassword'))
                                ? <span class="comment-error-tip">{rePasswordError.join(',')}</span>
                                : null}
                        </List.Item>
                    </List>
                </div>
                <div class="plr10 pt35">
                    <input type="button" id="resetPwdBtn" onClick={this.resetPwd.bind(this)} class="wp100 h50 bg_red t_white special-button" value="保存"/>
                </div>
            </div>
        );
    }
}
export default createForm()(ResetPwd);
