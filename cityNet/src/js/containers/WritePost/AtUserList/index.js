import React, {Component} from 'react';
import {Flex, SearchBar} from 'antd-mobile';
import AtUserListHeader from './AtUserListHeader';
import {UserCtr} from '../../../controller/UserCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class AtUserList extends Component {
    constructor(){
        super();
        this.state = {
            searchValue: "",
            userList: []
        };
    }
    componentDidMount(){
        Util.showLoading();
        this.getFollowUserList().then(Util.hideLoading).catch(() => {});
    }
    // 获取关注用户列表
    getFollowUserList(){
        let userId = Util.getUserId();
        if(userId){
            return UserCtr.getFollowUserList(true)
                .then((data) => {
                    this.setState({userList: data});
                    return data;
                });
        }
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    /*
     * 点击头部关闭按钮时，清空搜索框数据，并调用props传入的方法关闭列表
     */
    handleClose(){
        this.setState({
            searchValue: ""
        });
        this.props.handleUserClose();
    }
    /*
     * 用户点击回车提交时，更新state里的值，并筛选用户列表数据
     * @param value    当前输入框的数据
     */
    handleSubmit(value){
        this.setState({
            searchValue: value
        });
    }
    /*
     * 用户输入数据时，更新state里的值，并筛选用户列表数据
     * @param value    当前输入框的数据
     */
    handleChange(value){
        this.setState({
            searchValue: value
        });
    }
    /*
     * 用户选中某位关注人时，清空搜索框数据，并调用props传入的选中事件方法
     * @param value    当前选中的用户的username
     */
    handleUserClick(nickname, e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            searchValue: ""
        });
        this.props.handleUserClick(nickname);
    }
    render() {
        let {userList, searchValue} = this.state;
        return (
            <div class="at-user-search-wrap">
                <AtUserListHeader handleUserClose={this.handleClose.bind(this)}/>
                <div style={{"height": "0.88rem"}}></div>
                <SearchBar
                    placeholder="请输入搜索关键词"
                    onSubmit={this.handleSubmit.bind(this)}
                    onChange={this.handleChange.bind(this)}
                />
                <ul class="b_e6_t">
                    {
                        userList.length
                        ? userList.map((user, index) => {
                            if(user.nickname.indexOf(searchValue) != -1)
                                return (
                                    <li onClick={this.handleUserClick.bind(this, user.nickname)} key={user.userId} class="wp100 pr bg_fff">
                                        <div class="follow-img plr15 w70 h50"><img class="wp100" src={Util.formatListThumbanailAvatar(user.photo)}/></div>
                                        <div class="follow-txt h50 b_e6_b pl70 wp100">{user.nickname}</div>
                                    </li>
                                );
                            else
                                return "";
                        })
                        : Util.noData("暂无联系人")
                    }
                </ul>
            </div>
        )
    }
}
