import React, {Component} from 'react';
import Tloader from 'react-touch-loader';
import className from 'classnames';
import NormalHeader from '../../NormalHeader';
import ManagePostItems from './ManagePostItems';
import {Tabs, Flex} from 'antd-mobile';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const TabPane = Tabs.TabPane;
const Util = require('../../../util/util');

export default class MyBlockManage extends Component {
    constructor(){
        super();
        this.state = {
            blockData: {
                splate: {}
            }
        }
    }
    componentDidMount(){
        Util.showLoading();
        this.getBlock().then(Util.hideLoading).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 获取板块详情
    getBlock(){
        return PostCtr.getBlockDetail(this.props.params.code, true)
            .then((data) => this.setState({blockData: data}));
    }
    render(){
        let {blockData} = this.state;
        return (
            <div class="myBlockManage box">
                <NormalHeader title="板块管理"/>
                <div class="themeHeader">
                    <Flex justify="center" align="start">
                        <div class="themePic1"><img src={Util.formatImg(blockData.splate.pic)} alt=""/></div>
                        <Flex.Item className="themeHeaderFlex2">
                            <p class="themeTitle">名称：{blockData.splate.name}</p>
                            <p class="themeTitle">帖子数：{blockData.allPostCount || 0}</p>
                        </Flex.Item>
                        <Flex.Item>
                            <p class="themeTitle">置顶：{blockData.top || 0}</p>
                            <p class="themeTitle">精华：{blockData.essence || 0}</p>
                        </Flex.Item>
                    </Flex>


                </div>
                <Tabs defaultActiveKey="0" animated={false}>
                    <TabPane tab="审查" key="0">
                        <ManagePostItems
                            showCarousel={this.props.showCarousel}
                            plateCode={this.props.params.code}
                            slideIndex={0} />
                    </TabPane>
                    <TabPane tab="管理" key="1">
                        <ManagePostItems
                            showCarousel={this.props.showCarousel}
                            plateCode={this.props.params.code}
                            slideIndex={1} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
