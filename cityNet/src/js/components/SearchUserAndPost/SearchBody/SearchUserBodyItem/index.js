import React, {Component} from 'react';
import {Link} from 'react-router';
import './index.scss';

const rightIcon = require('../../../../../images/_pic.png');
const Util = require('../../../../util/util');

export default class SearchUserBodyItem extends Component {

    render(){
        let {uData} = this.props;
        return (
            <Link to={`/user/${uData.userId}`} class="wp100 pr">
                <div class="follow-img plr15 w70 h50 bg_fff"><img class="wp100" src={Util.formatListThumbanailAvatar(uData.userExt.photo)}/></div>
                <div class="follow-txt h50 b_e6_b pl70 wp100">{uData.nickname}<img class="follow-l" src={rightIcon}/></div>
            </Link>
        );
    }
}
