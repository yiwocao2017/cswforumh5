import {globalInfo} from '../containers/App';
import {Toast} from 'antd-mobile';
import 'fetch-ie8';
import {hashHistory} from 'react-router';

const Ajax = {
    get: (code, json, reload = false) => {
        var jsonType = typeof json;
        if(jsonType.toUpperCase() == "BOOLEAN"){
            json = {};
            reload = jsonType;
        }
        return Ajax.post(code, json, reload);
    },
    post: (code, json = {}, reload = true) => {
        let {cache} = globalInfo;
        let token = localStorage["token"];
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
            json = encodeURIComponent(JSON.stringify(json));
            param = 'code=' + code + '&json=' + json;
            cache[code][cache_url] = fetch('/forward/api', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: param
            }).then((res) => res.json());
        }
        return new Promise((resolve, reject) => {
            cache[code][cache_url]
                .then((res) => {
                    if(res.errorCode == "0")
                        resolve(res.data);
                    else if(res.errorCode == "4"){
                    	Toast.fail("登录超时，请重新登录", 1);
                        reject(res.errorInfo);
        				setTimeout(() => hashHistory.push('/user/login'), 1000);
                    }
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
