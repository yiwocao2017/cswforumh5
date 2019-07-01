import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../components/NormalHeader';
import CommodityOrderItem from './CommodityOrderItem';
import Tloader from 'react-touch-loader';
import {Tabs} from 'antd-mobile';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import './index.scss';

const TabPane = Tabs.TabPane;

export default class MyCommodityList extends Component {
    componentDidMount(){
        GeneralCtr.recordPageView();
    }
    render() {
        return (
            <div class="box order-list-wrap">
                <NormalHeader title="我的物品"/>
                <Tabs class="tloaderDiv flex-column" defaultActiveKey="0" animated={false}>
                    <TabPane tab="已支付" key="0">
                        <CommodityOrderItem status={2}/>
                    </TabPane>
                    <TabPane tab="已取货" key="1">
                        <CommodityOrderItem status={4}/>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}
