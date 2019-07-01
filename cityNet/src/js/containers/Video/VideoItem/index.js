import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import './index.scss';

const Util = require('../../../util/util');

export default class VideoItem extends Component {

    render() {
        let {video} = this.props;
        return (
            <li class="plr5 wp50 mtb5 fl border-box">
                <Link to={`/video/iframe?url=${video.url}&title=${encodeURIComponent(video.name)}&imgsrc=${video.pic}`} class="wp100 inline_block over-hide">
                    <div class="wp100 h130 over-hide border-box"><img class="wp100 hp100" src={Util.formatMallListImg(video.pic)}/></div>
                    <div class="wp100 p10 commodity-title t_es">{video.name}</div>
                </Link>
            </li>
        );
    }
}
