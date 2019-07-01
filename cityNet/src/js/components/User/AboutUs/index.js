import React, {Component} from 'react';
import NormalHeader from '../../NormalHeader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class AboutUs extends Component {
    constructor(){
        super();
        this.state = {
            content: "",
            company: Util.getCompany()
        }
    }
    componentDidMount(){
        GeneralCtr.getSysConfig("cswDescription")
            .then((data) => {
                this.setState({
                    content: data.note
                });
            });
        GeneralCtr.recordPageView();
    }
    render() {
        let {content, company} = this.state;
        return (
            <div>
                <NormalHeader title="关于城市网"/>
                <div class="aboutCity-detail" dangerouslySetInnerHTML={{__html: content}}></div>
                <div class="aboutCity-detail">
                    {company.mobile ? <div>联系电话：{company.mobile}</div> : ""}
                    {company.remark ? <div>服务时间：{company.remark}</div> : ""}
                </div>
            </div>
        );
    }
}
