import React, {Component} from 'react';
import PostItem from './PostItem';
import './index.scss';

export default class HeadLinePosts extends Component {
    render() {
        let {
            postData
        } = this.props;
        return (
            <div className="new-list">
            <div class="zhongbg"></div>
                <ul>
                    {
                        postData.length && postData.map((data, index) => (
                            <PostItem key={data.code} imgUrl={data.picArr || []} title={data.title} publishDatetime={data.publishDatetime} code={data.code} totalReadTimes={data.sumRead}/>
                        )) || ""
                    }
                </ul>
            </div>
        )
    }
}
