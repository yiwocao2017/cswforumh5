/*global*/
window.SYSTEM_CODE = 'CD-CCSW000008';
//window.PIC_PREFIX = 'http://oigx51fc5.bkt.clouddn.com/';
// window.PIC_PREFIX = 'http://oofr2abh1.bkt.clouddn.com/';
window.PIC_PREFIX = 'http://img.wanyiwoo.com/';
/*我的活动*/
window.ACTIVITY_URL = 'http://localhost:5206';
/*虹桥柳市的code设置*/
window.hqdoor = 'GS2017051110251051734';
window.liushi = '';
/*websdk*/
window.WebIM = {};
WebIM.config = {
    xmppURL: 'im-api.easemob.com',
    apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
    // appkey: '1173161124178193#zjsdcsw',
    appkey: 'tianleios#cd-test',
    https: false,
    isMultiLoginSessions: false,
    isAutoLogin: true,
    isWindowSDK: false,
    isSandBox: false,
    isDebug: false,
    autoReconnectNumMax: 4,
    autoReconnectInterval: 2,
    isWebRTC: false,
    heartBeatWait: 4500,
    isHttpDNS: false
};
