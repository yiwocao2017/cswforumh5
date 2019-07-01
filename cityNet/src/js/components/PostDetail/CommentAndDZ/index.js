import React, {Component} from 'react';
import className from 'classnames';
import CommentItem from '../CommentItem';
import DZItem from '../DZItem';
import './index.scss';

export default class CommentAndDZ extends Component {
    handleClick(index, e){
        e.stopPropagation();
        e.preventDefault();
        this.props.handleChange(index);
    }
    render(){
        let {
            activeNavIndex,
            commentList,
            likeList,
            handleCommentItemClick,
            sumLike,
            sumComment
        } = this.props;
        let tabInkBarClass = className({
            'am-tabs-ink-bar': true,
            'am-tabs-bar-left': activeNavIndex == "0",
            'am-tabs-bar-right': activeNavIndex == "1"
        });
        let tabBarClass1 = className({
            "am-tabs-tab-active": activeNavIndex == "0",
            "am-tabs-tab": true
        });
        let tabBarClass2 = className({
            "am-tabs-tab-active": activeNavIndex == "1",
            "am-tabs-tab": true
        });
        let tabContClass1 = className({
            "post-tabpane-active": activeNavIndex == "0",
            "post-tabpane": true
        });
        let tabContClass2 = className({
            "post-tabpane-active": activeNavIndex == "1",
            "post-tabpane": true
        });
        sumComment = sumComment > 100 ? "100+" : sumComment;
        sumLike = sumLike > 100 ? "100+" : sumLike;
        return (
            <div class="am-tabs am-tabs-top post-detail-bottom-tabs">
                <div role="tablist" class="am-tabs-bar">
                    <div class={tabInkBarClass}></div>
                    <div className={tabBarClass1} onClick={this.handleClick.bind(this, 0)}>评价({sumComment})</div>
                    <div className={tabBarClass2} onClick={this.handleClick.bind(this, 1)}>点赞({sumLike})</div>
                </div>
                <div class="post-tabs-content">
                    <div className={tabContClass1}>
                        {
                            commentList && commentList.length ? commentList.map((item, index) => (
                                <CommentItem handleCommentItemClick={handleCommentItemClick} key={item.code} itemData={item} />
                            )) : <div class="post-comment-item">暂无评论</div>
                        }
                    </div>
                    <div className={tabContClass2}>
                        {
                            likeList && likeList.length ? likeList.map((item, index) => (
                                <DZItem key={item.talker} itemData={item} />
                            )) : <div class="post-comment-item">暂无点赞</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
CommentAndDZ.PropTypes = {
    activeNavIndex: React.PropTypes.string
}
