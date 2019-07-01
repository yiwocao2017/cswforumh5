import React, {Component} from 'react';
import {Link} from 'react-router';
import {Badge} from 'antd-mobile';
import './index.scss';

const Util = require('../../../util/util');

export default class NavLink extends Component {
    handleNavClick(e){
        e.preventDefault();
        e.stopPropagation();
        let {navIndex, navUrl} = this.props;
        if(navIndex == 2 || navIndex == 4){
            if(!Util.isLogin()){
                Util.goLogin();
                return;
            }
        }
        Util.goPath(navUrl);
    }
    render() {
        // Util.formatImg(menuData[0].pic)
        const {active, icoUrl, navUrl, linkName, imgClass, navIndex, chatRoomData} = this.props;
        let imgUrl = icoUrl.split("||");
        let userId = Util.getUserId();
        let noReadCount = userId && chatRoomData && chatRoomData[userId] && chatRoomData[userId].noReadCount || 0;
        let linkClass = 'nav-root';
        linkClass = linkClass + (active ? " active" : "");
        if(active && navIndex !== 2){
            imgUrl = Util.formatImg(imgUrl[1] || imgUrl[0]);
        }else{
            imgUrl = Util.formatImg(imgUrl[0]);
        }
        return (
            <div className={linkClass} onClick={this.handleNavClick.bind(this)}>
                <div><img src={imgUrl} className={imgClass} alt="linkName"/></div>
                <span class="nav-link-name">{linkName}</span>
                {
                    navIndex == 4
                        ? ( noReadCount ?
                                <Badge text={noReadCount} style={{backgroundColor: '#d23e3e'}} />
                                : ""
                          )
                        : ""
                }
            </div>
        )
    }
}
