import React, {
    Component
} from 'react';
import {
    Toast,
    Modal
} from 'antd-mobile';
import initReactFastclick from 'react-fastclick';

initReactFastclick();

const Util = require('./util/util.js');

export const globalInfo = {
    cache: {}
};

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            hasComp: 0
        }
    }
    componentDidMount() {
        let token, userId, companyCode, redirectUrl = "";
        if (/comp=([^&#]+)/.exec(location.href)) {
            companyCode = RegExp.$1;
            if (/tk=([^&#]+)/.exec(location.href)) {
                token = RegExp.$1;
                userId = /T(.+)TK.*/.exec(token)[1];
                Util.setUser({
                    userId,
                    token
                });
                if (/(#\/[^\?]+)/.exec(location.href)) {
                    redirectUrl = RegExp.$1;
                }
                if (location.replace) {
                    location.replace(location.origin + "?comp=" + companyCode + redirectUrl);
                } else {
                    location.href = location.origin + "?comp=" + companyCode + redirectUrl;
                }
            } else {
                Util.setCompanyCode(companyCode);
                this.setState({
                    hasComp: 1
                });
            }
        } else {
            Toast.fail("未传入公司信息");
            return;
        }
    }
    render() {
        return (
            <div>{this.state.hasComp ? this.props.children : ""}</div>
        )
    }
}
