import React, {Component} from 'react';
import {Grid} from 'antd-mobile';
import './index.scss';

export default class IMEmojiGrid extends Component {
    onClick(_el, index) {
        let {handleEmojiClick} = this.props;
        if(handleEmojiClick)
            this.props.handleEmojiClick(_el, index);
    }
    render() {
        return (
            <Grid
                className="im-list-content"
                data={WebIM.Emoji.faces}
                columnNum={7}
                isCarousel
                carouselMaxRow={4}
                hasLine={false}
                onClick={this.onClick.bind(this)}
                renderItem={(dataItem) => {
                    let iClass = "face icon_" + dataItem.index;
                    return <i className={iClass}></i>
                }}
              />
        )
    }
}
