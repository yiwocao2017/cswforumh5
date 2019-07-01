const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const UserCtr = {
    /*
     * 登录
     * params: {loginName,loginPwd}
     */
    login: (params) => {
        params.kind = "f1";
        return Ajax.post("805043", params);
    },
    /*
     * 微信登录
     * params: {code, mobile?, smsCaptcha?}
     */
    wxLogin: (params) => {
        params.companyCode = Util.getCompanyCode();
        params.isRegHx = 1;
        return Ajax.post("805151", params);
    },
    /*
     * 注册
     * params: {mobile, loginPwd , smsCaptcha, companyCode}
     */
    register: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.loginPwd);
        params.isRegHx = "1";
        return Ajax.post("805076", params);
    },
    /*
     * 修改登录名
     * params: {loginName}
     */
    changeLoginName: (params) => {
        params.userId = Util.getUserId();
        return Ajax.post("805150", params);
    },
    /*
     * 修改手机号
     * params: {newMobile, smsCaptcha}
     */
    changeMobile: (params) => {
        params.userId = Util.getUserId();
        return Ajax.post("805047", params);
    },
    /*
     * 保存用户扩展信息
     * params: {nickname, birthday, gender, email, introduce, photo}
     */
    saveExtInfo: (params) => {
        params.userId = Util.getUserId();
        return Ajax.post("610126", params);
    },
    /*
     * 修改密码
     * params: {oldLoginPwd, newLoginPwd}
     */
    resetPwd: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.newLoginPwd);
        params.userId = Util.getUserId();
        return Ajax.post("805049", params);
    },
    /*
     * 找回密码
     * params: {mobile, smsCaptcha, newLoginPwd}
     */
    findPwd: (params) => {
        params.loginPwdStrength = Util.calculateSecurityLevel(params.newLoginPwd);
        params.kind = "f1";
        return Ajax.post("805048", params);
    },
    // 获取用户详情
    getUserInfo: (refresh) => (
        Ajax.get("805056", {
            userId: Util.getUserId()
        }, refresh)
    ),
    // 根据userId获取用户详情
    getUserInfoByUserId: (userId, refresh) => (
        Ajax.get("805056", {userId}, refresh)
    ),
    // 获取账户信息
    getAccount: (refresh) => (
        Ajax.get("802503", {
            "userId": Util.getUserId()
        }, refresh)
    ),
    /*
     * 分页查询粉丝
     * params: {start, limit}
     */
    getPageFans(params, refresh){
        params.toUser = Util.getUserId();
        return Ajax.get("805090", params, refresh);
    },
    // 分页查询关注
    getPageFollows(params, refresh){
        params.userId = Util.getUserId();
        return Ajax.get("805090", params, refresh);
    },
    // 获取关注的用户的列表
    getFollowUserList: (refresh) => (
        Ajax.get("805091", {
            userId: Util.getUserId()
        }, refresh)
    ),
    // 根据昵称获取用户的userId
    getUserByNickname: (nickname) => (
        Ajax.get("805255", {
            start: 1,
            limit: 1,
            nickname
        })
    ),
    /*
     * 根据昵称分页查询用户
     * params: {nickname,start,limit}
     */
    getPageUserByNickName(params, refresh){
        params.kind = "f1";
        params.status = "0";
        params.companyCode = Util.getCompanyCode();
        return Ajax.get("805255", params, refresh);
    },
    // 是否关注用户
    isFollowUser: (toUser) => (
        Ajax.post("805092", {
            toUser,
            userId: Util.getUserId()
        })
    ),
    // 关注用户
    followUser: (toUser) => (
        Ajax.post("805080", {
            toUser,
            userId: Util.getUserId(),
        })
    ),
    // 取消关注
    unFollowUser: (toUser) => (
        Ajax.post("805081", {
            toUser,
            userId: Util.getUserId()
        })
    ),
    // 获取用户等级列表
    getUserRank: (refresh) => (
        Ajax.get("805113", {
            start: 1,
            limit: 100
        }, refresh)
    ),
    // 获取用户发帖总数
    getTotalPost: (refresh) => (
        Ajax.get("610150", {
            userId: Util.getUserId(),
            status: 'NO_A'
        }, refresh)
    ),
    // 根据公司地址获取company
    getCompanyByAddr: (params, refresh) => (
        Ajax.get("806012", params, refresh)
    ),
    // 根据公司编号获取company
    getCompanyByCode: (code, refresh) => (
        Ajax.get("806010", {code}, refresh)
    ),
    // 获取公司列表
    getCompanyList: () => (
        Ajax.get("806017", {
            status: "2"
        })
    )
};
