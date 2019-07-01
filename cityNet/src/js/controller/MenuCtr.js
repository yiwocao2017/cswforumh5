const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const MenuCtr = {
    // 获取菜单列表
    getMenuList: (companyCode = Util.getCompanyCode(), refresh) => (
        Ajax.get('610087', {companyCode}, refresh)
    ),
    // 获取11个模块列表
    getModuleList: (companyCode = Util.getCompanyCode(), refresh) => (
        Ajax.get('610097', {companyCode}, refresh)
    ),
    // 获取banner列表
    getBannerList: (companyCode = Util.getCompanyCode(), refresh) => (
        Ajax.get('610107', {
            companyCode,
            location: 1,
            orderColumn: "order_no",
            orderDir: "asc"
        }, refresh)
    )
};
