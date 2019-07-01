const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const UserCtr = {
    // 获取用户详情
    getUserInfo: (userId = Util.getUserId(), refresh) => {
        return Ajax.get("805056", {userId}, refresh);
    }
};
