import {Toast} from 'antd-mobile';
import {globalInfo} from '../../containers/App';

const Util = require('../../util/util');

const IMUtil = {
    login: (username, password = "123456") => {
        username = username.toUpperCase();
        let token = WebIM.utils.getCookie()['webim_' + username];
        let options;
        return new Promise((resolve,reject) => {
            // if(token){
            //     options = {
            //         apiUrl: WebIM.config.apiURL,
            //         accessToken: 'token',
            //         appKey: WebIM.config.appkey,
            //         success: () => {
            //             resolve();
            //         },
            //         error: (error) => {
            //             Toast.fail('环信登录失败!!!', 2);
            //             reject(error);
            //         }
            //     };
            // }else{
                options = {
                    apiUrl: WebIM.config.apiURL,
                    user: username,
                    pwd: password,
                    appKey: WebIM.config.appkey,
                    success: (token) => {
                        var token = token.access_token;
                        WebIM.utils.setCookie('webim_' + username, token, 1);
                        resolve();
                    },
                    error: (error) => {
                        Toast.fail('环信登录失败!!!', 1);
                        reject(error);
                    }
                };
            // }
            IMUtil.close();
            ChatGlobalInfo.conn.open(options);
        });
    },
    registerUser: (username, password = "123456", nickname = "") => {
        username = username.toUpperCase();
        return new Promise((resolve,reject) => {
            let options = {
                username: username,
                password: password,
                nickname: nickname,
                appKey: WebIM.config.appkey,
                success: () => {
                    IMUtil.login(username, password);
                    resolve();
                },
                error: (error) => {
                    Toast.fail('环信注册失败!!!', 1);
                    reject(error);
                },
                apiUrl: WebIM.config.apiURL
            };
            ChatGlobalInfo.conn.registerUser(options);
        });
    },
    close: () => {
        ChatGlobalInfo.conn.close();
    },
    sendTextMsg: (content, toUser, nickname, photo) => {
        return new Promise((resolve, reject) => {
            let id = ChatGlobalInfo.conn.getUniqueId();  // 生成本地消息id
            let msg = new WebIM.message('txt', id);      // 创建文本消息
            let ext = {
                "nickname": nickname,
                "photo": photo
            };

            msg.set({
                msg: content,                  // 消息内容
                to: toUser,                          // 接收消息对象（用户id）
                roomType: false,
                ext: ext,
                success: (id, serverMsgId) => {
                    resolve(msg);
                },
                fail: (error) => {
                    reject(error);
                }
            });

            msg.body.chatType = 'singleChat';
            ChatGlobalInfo.conn.send(msg.body);
        });
    },
    encode: (str) => {
        if (!str || str.length === 0) {
            return '';
        }
        var s = '';
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/<(?=[^o][^)])/g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    },
    getBrief: (data, type) => {
        var brief = '';
        switch(type){
            case 'txt':
                // brief = WebIM.utils.parseEmoji(IMUtil.encode(data).replace(/\n/mg, ''));
                brief = IMUtil.encode(data).replace(/\n/mg, '');
                break;
            case 'emoji':
                brief = data;
                break;
            default:
                break;
        }
        return brief;
    },
    // 发送表情消息时，本地添加表情内容时，解析用的
    _parseEmojiCont: (msg) => {
        let emoji = WebIM.Emoji
        for (let face in emoji.map) {
            if (emoji.map.hasOwnProperty(face)) {
                while (msg.indexOf(face) > -1) {
                    msg = msg.replace(face, '<i class="face icon_'+emoji.map[face]+'"></i>');
                }
            }
        }
        return msg;
    },
    // 收到表情消息时，解析表情用的
    _getEmojiEle: (msg) => {
        return '<i class="face icon_'+msg.substr(msg.lastIndexOf("/") + 1)+'"></i>';
    },
    // 解析消息里的表情图标
    parseEmojiContent: (msg, type) => {
        let brief = "";
        if(type == "emoji"){
            for (var i = 0, l = msg.length; i < l; i++) {
                brief += msg[i].type === 'emoji'
                    ? IMUtil._getEmojiEle(msg[i].data)
                    : IMUtil.encode(msg[i].data);
            }
            return brief;
        }
        return IMUtil._parseEmojiCont(msg);
    },
    scrollIntoView: (node) => {
        setTimeout(() => {
            node.scrollIntoView(true);
        }, 50);
    },
};
module.exports = IMUtil;
