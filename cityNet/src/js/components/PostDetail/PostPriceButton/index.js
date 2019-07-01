import React, {Component} from 'react';
import {Flex, Modal, Toast} from 'antd-mobile';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');
const Icon = require('../../../../images/shang.png');
const jlbzIcon = require('../../../../images/jlbz.png');

const prompt = Modal.prompt;

export default class PostPriceButton extends Component {
    handlePriceClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        let {postCode} = this.props;
        prompt('打赏', '请输入打赏数量', [
            {
                text: '取消'
            }, {
                text: '确认',
                onPress: amount => new Promise((resolve) => {
                    if(!/^\d+(?=\.\d+)?$/.test(amount)){
                        Toast.info("打赏数量必须为数字", 1);
                        resolve();
                        return;
                    }else if(+amount <= 0){
                        Toast.info("打赏数量不能小于0", 1);
                        resolve();
                        return;
                    }
                    Util.showLoading("打赏中...");
                    PostCtr.pricePost(postCode, amount)
                        .then((data) => {
                            resolve();
                            Toast.success("打赏成功", 1);
                            this.props.handlePraiseCallback();
                        }).catch(resolve);
                })
            }
        ], 'plain-text');
    }
    render() {
        return (
            <div class="price-btn-wrap" onClick={this.handlePriceClick.bind(this)}>
                <Flex justify="center">
                    <Flex.Item>
                        <img class="jlbz-icon" src={jlbzIcon}/>
                        <span class="jlbz-span">好贴就要任性打赏</span>
                    </Flex.Item>
                    <img class="price-icon" src={Icon}/>
                </Flex>
            </div>
        )
    }
}
