import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import App from './App';

// 404页面
const NotFoundPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./404').default)
    }, 'NotFoundPage');
};
// 活动列表
const Activities = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Activities').default)
    }, 'Activities');
};
// 活动详情
const Activity = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Activity').default)
    }, 'Activity');
};
// 提交活动订单
const ApplyOrder = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/ApplyOrder').default)
    }, 'ApplyOrder');
};
// 支付活动订单
const Pay = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/Pay').default)
    }, 'Pay');
};
// 我的活动订单列表
const OrderList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/OrderList').default)
    }, 'OrderList');
};

export default(
    <Route path="/" component={App}>
        {/* <Route path="list" getComponent={Activities}>
            <Route path="activity/:code" getComponent={Activity}/>
        </Route> */}
        <IndexRedirect to="/list"/>
        <Route path="list" getComponent={Activities}>
            <Route path="activity/:code" getComponent={Activity}/>
        </Route>

        {/* <Route path="activity/:code" getComponent={Activity}/> */}
        <Route path="apply/:code" getComponent={ApplyOrder}/>
        <Route path="pay/:code" getComponent={Pay}/>
        <Route path="orders" getComponent={OrderList}/>

        <Route path="*" getComponent={NotFoundPage}/>
    </Route>
);
