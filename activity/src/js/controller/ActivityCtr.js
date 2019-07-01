const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const ActivityCtr = {
    // 分页查询活动列表
    getPageActivities: (param = {start: 1, limit: 10}, refresh) => {
        param.status = "1";
        param.companyCode = Util.getCompanyCode();
        param.userId = Util.getUserId();
        // param.orderColumn = ""
        // param.orderDir = "desc";
        return Ajax.get("660010", param, refresh);
    },
    // 获取活动详情
    getActivity: (code, refresh) => (
        Ajax.get("660011", {
            code,
            userId: Util.getUserId()
        }, refresh)
    ),
    readActivity: (code) => (
        Ajax.post("660005", {code})
    ),
    // 活动报名
    applyActivity: (param) => {
        param.applyUser = Util.getUserId();
        return Ajax.post("660020", param);
    },
    // 支付活动订单
    payOrder: (code) => (
        Ajax.post("660021", {
            orderCode: code,
            payType: "2"
        })
    ),
    // 分页查询活动订单
    getPageOrders: (param = {start: 1, limit: 10}, refresh) => {
        param.applyUser = Util.getUserId();
        return Ajax.get("660025", param, refresh);
    },
    // 详情查询订单
    getOrder: (orderCode, refresh) => (
        Ajax.get("660026", {orderCode}, refresh)
    )
};
