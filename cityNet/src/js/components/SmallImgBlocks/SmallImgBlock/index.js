import React, {Component} from 'react'
import {Link} from 'react-router';

const Util = require('../../../util/util');

export default class SmallImgBlock extends Component {
    constructor() {
        super();
    }
    // 签到
    signInClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.handleSignInClick(e);
    }

    // 同城活动
    handleActivityClick(e){
        this.props.handleActivityClick(e);
    }

    render() {
        let {imgName, imgUrl, pathUrl, index} = this.props;
        let imgBlock = "";
        let result = Util.parseSubSystemUrl(pathUrl);
        let imgStyle = {
            // "marginRight": index % 4 == 3 ? "0" : "0.12rem"
        };

        if(result.outUrl){
            imgBlock = <div style={imgStyle} class="small-img-block"><a href={result.url}><div><img src={Util.formatImg(imgUrl)} alt={imgName}/></div><p>{imgName}</p></a></div>
        }else{
            if(result.signin){
                imgBlock = <div style={imgStyle} class="small-img-block" onClick={this.signInClick.bind(this)}><a href="jacascript:void(0)"><div><img src={Util.formatImg(imgUrl)} alt={imgName}/></div><p>{imgName}</p></a></div>
            }else if(result.activity){
                imgBlock = <div style={imgStyle} class="small-img-block" onClick={this.handleActivityClick.bind(this)}><a href="jacascript:void(0)"><div><img src={Util.formatImg(imgUrl)} alt={imgName}/></div><p>{imgName}</p></a></div>
            }else{
                imgBlock = <div style={imgStyle} class="small-img-block"><Link to={result.url}><div><img src={Util.formatImg(imgUrl)} alt={imgName}/></div><p>{imgName}</p></Link></div>
            }
        }
        return imgBlock;
    }
}
