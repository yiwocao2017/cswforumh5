import React, {Component} from 'react';
import {Link} from 'react-router';
import {List} from 'antd-mobile';
import NormalHeader from '../../NormalHeader';
import './index.scss';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';

const Util = require('../../../util/util');
const rightIcon = require('../../../../images/_pic.png');

export default class MobileAndPwd extends Component {
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
        return (
            <div>
                <NormalHeader title="账号和密码"/>
                {/* <div style={{
                    "height": "0.88rem"
                }}></div> */}
                <div class="border-box mobile-pwd-wrap">
                    <List>
                        <List.Item>
                            <Link class="wp100 hp100 inline_block pr" to="/user/resetPwd">登录密码<img class="right-icon" src={rightIcon} alt=""/></Link>
                        </List.Item>
                        <List.Item>{this.state.user.mobile}  手机号</List.Item>
                    </List>
                </div>
            </div>
        );
    }
}
