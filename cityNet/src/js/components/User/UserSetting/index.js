import React, {Component} from 'react';
import {Link} from 'react-router';
import {Modal} from 'antd-mobile';
import {globalInfo} from '../../../containers/App';
import NormalHeader from '../../../components/NormalHeader';
import './index.scss';

const Util = require('../../../util/util');
const rightIcon = require('../../../../images/_pic.png');

export default class UserSetting extends Component {
    constructor() {
        super();
        this.state = {
            buffer: Util.calculateBuffer()  //缓存大小
        };
    }
    componentWillAmount(){
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
    }
    // 退出登录
    logout(e){
        e.stopPropagation();
        e.preventDefault();
        Util.clearUser();
        Util.goPath('/home');
    }
    clearBuffer(e){
        e.stopPropagation();
        e.preventDefault();
        Modal.alert('清除缓存', '确定清除缓存吗?', [
            { text: '取消', onPress: () => {} },
            { text: '确定', onPress: Util.clearBuffer }
        ]);
    }
    render(){
        return (
            <div>
                <NormalHeader title='设置'/>
                <div class="setMenu">
                    <ul>
                        <li><Link className="wp100 hp100 inline_block" to="/user/changeLoginName"><span>修改登录名</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link className="wp100 hp100 inline_block" to="/user/mobileAndPwd"><span>账号和密码</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link className="wp100 hp100 inline_block" to="/user/changeMobile"><span>修改手机号</span><img src={rightIcon} alt=""/></Link></li>
                        <li><Link className="wp100 hp100 inline_block" to="/user/editUserInfo"><span>个人资料</span><img src={rightIcon} alt=""/></Link></li>
                        <li onClick={this.clearBuffer.bind(this)}>
                            <span>清除缓存</span><img src={rightIcon} alt=""/>
                            <div class="setMenu-item-extra">{this.state.buffer}</div>
                        </li>
                    </ul>
                </div>
                <div class="setting-logout" onClick={this.logout.bind(this)}>退出登录</div>
            </div>
        );
    }
}
