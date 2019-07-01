import React, {Component} from 'react';
import {Link} from 'react-router';
import {Flex} from 'antd-mobile';
import './index.scss';

const Util = require('../../../util/util');

export default class PostPriceUserList extends Component {
    getMore(e){
        e.preventDefault();
        e.stopPropagation();
        let {postCode} = this.props;
        Util.goPath(`/praise/${postCode}`);
    }
    render() {
        let {totalPraise, praiseData, postCode} = this.props;
        return (
            <div class="price-userlist-wrap">
                <div class="price-userlist-title"><span class="userlist-title-num">{totalPraise}</span>人打赏</div>
                <Flex justify="start" wrap="wrap">
                    {
                        praiseData.length
                        ? praiseData.map((data, index) => (
                            <Link key={`index${index}`} to={`/user/${data.talker}`}><img class="price-userlist-img" src={Util.formatListThumbanailAvatar(data.photo)}/></Link>
                        ))
                        : ""
                    }
                </Flex>
                {totalPraise > praiseData.length ? <div class="price-userlist-more" onClick={this.getMore.bind(this)}>更多</div> : ""}
            </div>
        )
    }
}
