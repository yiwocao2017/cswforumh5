import React, {Component} from 'react';
import NormalHeader from '../../../NormalHeader';
import './index.scss';

export default class AboutCSW extends Component {
    render() {
        let {content} = this.props;
        return (
            <div class="box">
                <NormalHeader title="城市网服务协议" goBack={this.props.goBack}/>
                <div class="aboutCity-detail" dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
        );
    }
}
