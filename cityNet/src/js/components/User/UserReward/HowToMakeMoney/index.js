import React, {Component} from 'react';
import NormalHeader from '../../../NormalHeader';
import {GeneralCtr} from '../../../../controller/GeneralCtr';
import './index.scss';

const Util = require('../../../../util/util');
const Ajax = require('../../../../util/ajax');

export default class HowToMakeMoney extends Component {
    constructor(){
        super();
        this.state = {
            content: ""
        }
    }
    componentDidMount(){
        GeneralCtr.getSysConfig("cswReward")
            .then((data) => {
                this.setState({
                    content: data.note
                });
            });
    }
    render() {
        let {content} = this.state;
        return (
            <div>
                <NormalHeader title="如何赚赏金"/>
                <div class="aboutCity-detail" dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
        );
    }
}
