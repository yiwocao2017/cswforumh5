import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NormalHeader from '../../../components/NormalHeader';
import './index.scss';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import {globalInfo} from '../../../containers/App';

const Util = require('../../../util/util');

class ChangeLoginName extends Component {
    constructor(){
        super();
        this.state = {
            user: {}
        }
    }
    componentDidMount(){
        Util.showLoading();
        this.getUserInfo().then(Util.hideLoading).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 修改登录名
    changeLoginName(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.form.validateFields((error, param) => {
            if(!error){
                Util.showLoading("修改中...");
                UserCtr.changeLoginName(param)
                    .then((data) => {
                        globalInfo.user.loginName = param.loginName;
                        Toast.success("登录名修改成功", 1);
                        setTimeout(Util.historyBack, 1e3);
                    }).catch(() => {});
            }
        });
    }
    // 获取用户详情
    getUserInfo(){
        if(!globalInfo.user.userId)
            return UserCtr.getUserInfo(true)
                .then((data) => {
                    this.setState({user: data});
                    globalInfo.user = data;
                });
        else
            return new Promise((resolve) => {
                this.setState({user: globalInfo.user});
                resolve();
            });
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let loginNameError = "";
        return (
            <div>
                <NormalHeader title="修改登录名"/>
                <div class="border-box change-loginname-wrap">
                    <List renderHeader={() => (<span class="t_red">登录名只能修改一次，请认真考虑后再做修改</span>)}>
                        <InputItem value={this.state.user.loginName} editable={false} disabled>原登录名</InputItem>
                        <InputItem {...getFieldProps('loginName', {
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })} placeholder="请输入登录名">新登录名</InputItem>
                        {(loginNameError = getFieldError('loginName'))
                            ? <span class="comment-error-tip">{loginNameError.join(',')}</span>
                            : null}
                    </List>
                </div>
                <div class="plr10 pt35">
                    <input type="button" id="changeLoginNameBtn" onClick={this.changeLoginName.bind(this)} class="wp100 h50 bg_red t_white special-button" value="保存"/>
                </div>
            </div>
        );
    }
}
export default createForm()(ChangeLoginName);
