import React, {Component} from 'react';
import {WhiteSpace, Flex} from 'antd-mobile';
import className from 'classnames';
import './index.scss';

const Util = require('../../../util/util');

export default class ChoseBlock extends Component {
    // 选中板块
    handleBlockClick(index, e){
        e.preventDefault();
        e.stopPropagation();
        this.props.handleBlockClick(index);
    }
    // 隐藏板块列表
    hideChoseBlock(e){
        e.stopPropagation();
        e.preventDefault();
        this.props.hideChoseBlock();
    }

    render() {
        let {blockData, plateCode} = this.props;
        if(!plateCode && blockData.length){
            plateCode = blockData[0].code;
        }
        return (
            <div class="chose-block">
                <div style={{height: "0.88rem"}}></div>
                <WhiteSpace size="sm" />
                <Flex wrap="wrap" align="start">
                    {
                        blockData.length ? blockData.map((data, index) => (
                            <div class={className({
                                "chose-block-item": true,
                                "active": data.code == plateCode
                            })} key={`index${index}`} onClick={this.handleBlockClick.bind(this, index)}>
                                <img src={Util.formatThumbanailImg(data.pic)}/>
                                <div>{data.name}</div>
                            </div>
                        )) : ""
                    }
                </Flex>
                <div onClick={this.hideChoseBlock.bind(this)} class="close-chose-block"><div></div></div>
                <div class="chose-block-mask"></div>
            </div>
        )
    }
}
