// 我的板块
import React, {Component} from 'react';
import {Link} from 'react-router';
import './index.scss';
import Tloader from 'react-touch-loader';
import className from 'classnames';
import NormalHeader from '../../NormalHeader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';


const commentIcon = require('../../../../images/评论－无边框@2x.png');
const DZIcon = require('../../../../images/点赞无边框@2x.png');
const Util = require('../../../util/util');

export default class MyBlock extends Component {
    constructor(){
        super();
        this.state = {
            blockData: [],
            initializing: 1,
            refreshedAt: Date.now(),
        }
    }
    componentDidMount(){
        Util.showLoading();
        this.getBlockList(true).then(() => {
            this.setState({initializing: 2});
            Util.hideLoading();
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    handleRefresh(resolve) {
        this.getBlockList(true).then(resolve);
    }
    // 获取我的板块列表
    getBlockList(refresh){
        return PostCtr.getBlockByUserId(refresh)
            .then((data) => this.setState({blockData: Util.bubbleSort(data, "orderNo")}));
    }
    render(){
        let {initializing, refreshedAt, blockData} = this.state;

        return (
            <div class="user-mine-block box">
                <NormalHeader title="我的板块"/>
                <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={false} className="tloader headNoBottom">
                    <div class="moudleList">
                        <ul>
                            {
                                blockData.length ? blockData.map((block, index) => (
                                    <li key={block.code}>
                                        <Link to={`/user/block/manage/${block.code}`}>
                                            <div class="moudleImg"><img src={Util.formatImg(block.pic)} alt=""/></div>
                                            <p>{block.name}</p>
                                            <div class="moudle-ion">
                                                <div><img src={DZIcon} alt=""/> <span>{block.allLikeNum || 0}</span></div>
                                                <div><img src={commentIcon} alt=""/> <span>{block.allCommentNum || 0}</span></div>
                                            </div>
                                            <span class="moudle-enter">进入</span>
                                        </Link>
                                    </li>
                                )) : ""
                            }
                        </ul>
                    </div>
                </Tloader>
            </div>
        );
    }
}
