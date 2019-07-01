const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const GeneralCtr = {
    // 获取微信sdk初始化的参数
    getInitWXSDKConfig: () => (
        Ajax.get("807910", {
            companyCode: SYSTEM_CODE,
            url: location.href.split('#')[0]
        }, true)
    ),
    // 获取appId
    getAppId: () => (
        Ajax.get("806031", {
            companyCode: SYSTEM_CODE,
            account: "ACCESS_KEY",
            type: "3"
        }, true)
    ),
    // 根据ckey获取系统参数
    getSysConfig: (ckey, refresh) => (
        Ajax.get("807717", {ckey}, refresh)
    ),
    /*
     * 分页获取系统消息
     * params: {start,limit}
     */
    getPageSysMessage: (params, refresh) => {
        params.status = "1";
        params.channelType = "4";
        params.toSystemCode = SYSTEM_CODE;
        params.toKind = "1";
        params.orderColumn = "pushed_datetime";
        params.orderDir = "desc";
        params.userId = Util.getUserId();
        return Ajax.get("804040", params, refresh);
    },
    /*
     * 分页查流水
     * params: {start,limit,accountNumber}
     */
    getPageFlow: (params, refresh) => (
        Ajax.get("802520", params, refresh)
    ),
    // 签到
    signIn: () => (
        Ajax.post("805100", {
            "userId": Util.getUserId(),
            "location": Util.getCompanyCode()
        })
    ),
    // 发送验证码
    sendCaptcha: (mobile, bizType) => (
        Ajax.post("805904", {
            mobile,
            bizType,
            kind: "f1"
        })
    ),
    // 新增pv接口
    recordPageView: () => (
        Ajax.post("610400", {
            companyCode: Util.getCompanyCode()
        })
    ),
    // 获取七牛token
    getQiniuToken: (refresh) => (
        Ajax.get("807900", refresh)
    ),
    // 分页查询视频
    getPageVideo: (params, refresh) => {
        params.status = "2";
        params.companyCode = Util.getCompanyCode();
        params.orderColumn = "order_no";
        params.orderDir = "asc";
        return Ajax.get("610055", params, refresh);
    },
    // 获取未读消息数
    getUnReadSmsCount: () => (
        Ajax.get("610146", {
            userId: Util.getUserId()
        }, true)
    )
};
