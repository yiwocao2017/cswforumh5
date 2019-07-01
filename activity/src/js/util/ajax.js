import {globalInfo} from '../App';
import {Toast} from 'antd-mobile';
import $ from 'jquery';

const Ajax = {
    get: (code, json, reload = false) => {
        return Ajax.post(code, json, reload);
    },
    post: (code, json = {}, reload = true) => {
        let {cache} = globalInfo;
        let token = sessionStorage["token"];
        json["systemCode"] = SYSTEM_CODE;
        token && (json["token"] = token);
        let param = {
            code: code,
            json: json
        };
        let cache_url = "/forward/api" + JSON.stringify(param);
        if (reload) {
            delete cache[code];
        }
        cache[code] = cache[code] || {};
        if (!cache[code][cache_url]) {
            param.json = JSON.stringify(json);
            cache[code][cache_url] = $.ajax({
                type: 'post',
                url: '/forward/api',
                data: param
            });
        }
        return new Promise((resolve, reject) => {
            cache[code][cache_url]
                .then((res) => {
                    if(res.errorCode == "0")
                        resolve(res.data);
                    else{
                        Toast.fail(res.errorInfo, 1);
                        reject(res.errorInfo);
                    }
                }).catch((error) => {
                    Toast.fail(error.toString(), 1);
                    reject(error);
                })
        });

    }
}
module.exports = Ajax;
