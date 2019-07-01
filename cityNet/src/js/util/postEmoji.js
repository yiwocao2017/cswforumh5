import React from 'react';
const Util = require('./util');

const postEmojiUtil = {
    emojiData: [
        {
            text: '→_→',
            page: 0,
            index: 0
        }, {
            text: '[微笑]',
            page: 0,
            index: 1
        }, {
            text: '[嘻嘻]',
            page: 0,
            index: 2
        }, {
            text: '[哈哈]',
            page: 0,
            index: 3
        }, {
            text: '[爱你]',
            page: 0,
            index: 4
        }, {
            text: '[挖鼻]',
            page: 0,
            index: 5
        }, {
            text: '[吃惊]',
            page: 0,
            index: 6
        }, {
            text: '[晕]',
            page: 0,
            index: 7
        }, {
            text: '[泪]',
            page: 0,
            index: 8
        }, {
            text: '[馋嘴]',
            page: 0,
            index: 9
        }, {
            text: '[抓狂]',
            page: 0,
            index: 10
        }, {
            text: '[哼]',
            page: 0,
            index: 11
        }, {
            text: '[可爱]',
            page: 0,
            index: 12
        }, {
            text: '[怒]',
            page: 0,
            index: 13
        }, {
            text: '[汗]',
            page: 0,
            index: 14
        }, {
            text: '[害羞]',
            page: 0,
            index: 15
        }, {
            text: '[困]',
            page: 0,
            index: 16
        }, {
            text: '[钱]',
            page: 0,
            index: 17
        }, {
            text: '[偷笑]',
            page: 0,
            index: 18
        }, {
            text: '[笑cry]',
            page: 0,
            index: 19
        }, {
            text: '[doge]',
            page: 0,
            index: 20
        }, {
            text: '[喵喵]',
            page: 0,
            index: 21
        }, {
            text: '[酷]',
            page: 0,
            index: 22
        }, {
            text: '[衰]',
            page: 0,
            index: 23
        }, {
            text: '[闭嘴]',
            page: 0,
            index: 24
        }, {
            text: '[鄙视]',
            page: 0,
            index: 25
        }, {
            text: '[色]',
            page: 0,
            index: 26
        }, {
            text: '[鼓掌]',
            page: 0,
            index: 27
        }, {
            text: '[悲伤]',
            page: 1,
            index: 0
        }, {
            text: '[思考]',
            page: 1,
            index: 1
        }, {
            text: '[生病]',
            page: 1,
            index: 2
        }, {
            text: '[亲亲]',
            page: 1,
            index: 3
        }, {
            text: '[怒骂]',
            page: 1,
            index: 4
        }, {
            text: '[太开心]',
            page: 1,
            index: 5
        }, {
            text: '[白眼]',
            page: 1,
            index: 6
        }, {
            text: '[右哼哼]',
            page: 1,
            index: 7
        }, {
            text: '[左哼哼]',
            page: 1,
            index: 8
        }, {
            text: '[嘘]',
            page: 1,
            index: 9
        }, {
            text: '[委屈]',
            page: 1,
            index: 10
        }, {
            text: '[吐]',
            page: 1,
            index: 11
        }, {
            text: '[可怜]',
            page: 1,
            index: 12
        }, {
            text: '[睡]',
            page: 1,
            index: 13
        }, {
            text: '[挤眼]',
            page: 1,
            index: 14
        }, {
            text: '[失望]',
            page: 1,
            index: 15
        }, {
            text: '[顶]',
            page: 1,
            index: 16
        }, {
            text: '[疑问]',
            page: 1,
            index: 17
        }, {
            text: '[困]',
            page: 1,
            index: 18
        }, {
            text: '[感冒]',
            page: 1,
            index: 19
        }, {
            text: '[拜拜]',
            page: 1,
            index: 20
        }, {
            text: '[黑线]',
            page: 1,
            index: 21
        }, {
            text: '[阴险]',
            page: 1,
            index: 22
        }, {
            text: '[互粉]',
            page: 1,
            index: 23
        }, {
            text: '[心]',
            page: 1,
            index: 24
        }, {
            text: '[伤心]',
            page: 1,
            index: 25
        }, {
            text: '[猪头]',
            page: 1,
            index: 26
        }, {
            text: '[熊猫]',
            page: 1,
            index: 27
        }, {
            text: '[兔子]',
            page: 2,
            index: 0
        }, {
            text: '[握手]',
            page: 2,
            index: 1
        }, {
            text: '[作揖]',
            page: 2,
            index: 2
        }, {
            text: '[赞]',
            page: 2,
            index: 3
        }, {
            text: '[耶]',
            page: 2,
            index: 4
        }, {
            text: '[good]',
            page: 2,
            index: 5
        }, {
            text: '[弱]',
            page: 2,
            index: 6
        }, {
            text: '[NO]',
            page: 2,
            index: 7
        }, {
            text: '[ok]',
            page: 2,
            index: 8
        }, {
            text: '[haha]',
            page: 2,
            index: 9
        }, {
            text: '[来]',
            page: 2,
            index: 10
        }, {
            text: '[威武]',
            page: 2,
            index: 11
        }, {
            text: '[鲜花]',
            page: 2,
            index: 12
        }, {
            text: '[钟]',
            page: 2,
            index: 13
        }, {
            text: '[浮云]',
            page: 2,
            index: 14
        }, {
            text: '[飞机]',
            page: 2,
            index: 15
        }, {
            text: '[月亮]',
            page: 2,
            index: 16
        }, {
            text: '[太阳]',
            page: 2,
            index: 17
        }, {
            text: '[微风]',
            page: 2,
            index: 18
        }, {
            text: '[下雨]',
            page: 2,
            index: 19
        }, {
            text: '[给力]',
            page: 2,
            index: 20
        }, {
            text: '[神马]',
            page: 2,
            index: 21
        }, {
            text: '[围观]',
            page: 2,
            index: 22
        }, {
            text: '[话筒]',
            page: 2,
            index: 23
        }, {
            text: '[奥特曼]',
            page: 2,
            index: 24
        }, {
            text: '[草泥马]',
            page: 2,
            index: 25
        }, {
            text: '[萌]',
            page: 2,
            index: 26
        }, {
            text: '[囧]',
            page: 2,
            index: 27
        }, {
            text: '[织]',
            page: 3,
            index: 0
        }, {
            text: '[礼物]',
            page: 3,
            index: 1
        }, {
            text: '[喜]',
            page: 3,
            index: 2
        }, {
            text: '[围脖]',
            page: 3,
            index: 3
        }, {
            text: '[音乐]',
            page: 3,
            index: 4
        }, {
            text: '[绿丝带]',
            page: 3,
            index: 5
        }, {
            text: '[蛋糕]',
            page: 3,
            index: 6
        }, {
            text: '[蜡烛]',
            page: 3,
            index: 7
        }, {
            text: '[干杯]',
            page: 3,
            index: 8
        }, {
            text: '[男孩儿]',
            page: 3,
            index: 9
        }, {
            text: '[女孩儿]',
            page: 3,
            index: 10
        }, {
            text: '[肥皂]',
            page: 3,
            index: 11
        }, {
            text: '[照相机]',
            page: 3,
            index: 12
        }, {
            text: '[浪]',
            page: 3,
            index: 13
        }, {
            text: '[沙尘暴]',
            page: 3,
            index: 14
        }
    ],
    // 解析发帖内容的 表情、换行符、@
    parseEmojiContent: (content) => {
        if(!content)
            return "";
        let contentEles = [], prevIndex = 0, nextIndex = 0, key = 0;
        // 把content按表情字符分割，按顺序push到contentEles里
        content.replace(/\[[^\]]+\]/ig, (emojiText, idx) => {
            let index = Util.findItemInArr(postEmojiUtil.emojiData, {text: emojiText}, "text");
            nextIndex = idx;
            if(index != -1){
                let item = postEmojiUtil.emojiData[index],
                    emojiClass = "face face_" + (item.page + 1) + " icon_" + item.index;
                let prevString = content.substring(prevIndex, nextIndex);
                let tempArr = postEmojiUtil._parseWrapCont(prevString);
                for(let i = 0, len = tempArr.length - 1; i <= len; i++){
                    if(i < len)
                        contentEles.push(<span key={`index${key++}`}><span>{postEmojiUtil._parseAtCont(tempArr[i])}</span><br/></span>);
                    else
                        contentEles.push(<span key={`index${key++}`}>{postEmojiUtil._parseAtCont(tempArr[i])}</span>);
                }
                contentEles.push(<i key={`index${key++}`} className={emojiClass}></i>);
                nextIndex += emojiText.length
                prevIndex = nextIndex;
                return "";
            }
            nextIndex += emojiText.length;
            let prevString = content.substring(prevIndex, nextIndex);
            let tempArr = postEmojiUtil._parseWrapCont(prevString);
            for(let i = 0, len = tempArr.length - 1; i <= len; i++){
                if(i < len)
                    contentEles.push(<span key={`index${key++}`}><span>{postEmojiUtil._parseAtCont(tempArr[i])}</span><br/></span>);
                else
                    contentEles.push(<span key={`index${key++}`}>{postEmojiUtil._parseAtCont(tempArr[i])}</span>);
            }
            prevIndex = nextIndex;
            return "";
        });
        let prevString = content.substring(prevIndex);
        let tempArr = postEmojiUtil._parseWrapCont(prevString);
        for(let i = 0, len = tempArr.length - 1; i <= len; i++){
            if(i < len)
                contentEles.push(<span key={`index${key++}`}><span>{postEmojiUtil._parseAtCont(tempArr[i])}</span><br/></span>);
            else
                contentEles.push(<span key={`index${key++}`}>{postEmojiUtil._parseAtCont(tempArr[i])}</span>);
        }
        return contentEles;
    },
    // 寻找内容里到换行符，并分割成数组
    _parseWrapCont: (cont) => {
        if(/\\n/.test(cont))
            return cont.split(/\\n/);
        return cont.split(/\n/);
    },
    // 转化换行符
    parseWrapCont: (cont) => {
        let tempArr = postEmojiUtil._parseWrapCont(cont),
            _result = [];
        for(let i = 0, len = tempArr.length - 1; i <= len; i++){
            let item = tempArr[i];
            if(i < len)
                _result.push(<span key={`index${i}`}><span>{item}</span><br/></span>);
            else
                _result.push(<span key={`index${i}`}><span>{item}</span></span>);
        }
        return _result;
    },
    // 寻找content里到@符号，并替换成span.goUserCenterSpan的格式
    _parseAtCont: (cont) => {
        let arr = [], prevIndex = 0, nextIndex = 0, key = 0;
        cont.replace(/@[^\s]+/g, (text, index) => {
            nextIndex = index;
            let prevCont = cont.substring(prevIndex, nextIndex);
            prevCont && arr.push(<span key={`at${key++}`}>{prevCont}</span>);
            arr.push(<span key={`at${key++}`} className="goUserCenterSpan">{text}</span>);
            prevIndex = nextIndex + text.length + 1;    //   + 1 因为在生成@user时，会默认在末尾加一个空格
        });
        arr.push(<span key={`at${key++}`}>{cont.substring(prevIndex)}</span>)
        return arr;
    }
};
module.exports = postEmojiUtil;
