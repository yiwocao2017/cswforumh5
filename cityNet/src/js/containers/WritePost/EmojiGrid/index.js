import React, {Component} from 'react';
import {Grid} from 'antd-mobile';
import './index.scss';

const postEmojiUtil = require('../../../util/postEmoji');

export default class EmojiGrid extends Component {
    onClick(_el, index) {
        let {handleEmojiClick} = this.props;
        if(handleEmojiClick)
            this.props.handleEmojiClick(_el, index);
    }
    render() {
        return (
            <Grid
                className="wrapper-face"
                data={postEmojiUtil.emojiData}
                columnNum={7}
                isCarousel
                carouselMaxRow={4}
                hasLine={false}
                onClick={this.onClick.bind(this)}
                renderItem={(dataItem, index) => {
                    let iClass = "face icon_" + dataItem.index + " face_" + (dataItem.page + 1);
                    return <i className={iClass}></i>
                }}
              />
        )
    }
}
