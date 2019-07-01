import React, {Component} from 'react';
import './index.scss';

const Util = require('../../../util/util');

export default class DZItem extends Component {
    // 点击用户昵称进入用户主页
    goUserCenter(e){
        e.preventDefault();
        e.stopPropagation();
        let {talker} = this.props.itemData;
        Util.goPath('/user/'+talker);
    }
    render(){
        let {nickname, photo} = this.props.itemData;

        return (
            <div class="post-dz-item" onClick={this.goUserCenter.bind(this)}>
                <img class="post-dz-item-img" src={Util.formatListThumbanailAvatar(photo)} />
                <span class="post-dz-item-title">{nickname}</span>
            </div>
        );
    }
}
