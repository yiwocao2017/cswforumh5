import React, {Component} from 'react';
import {Flex} from 'antd-mobile';
import './index.scss';
import SmallImgBlock from './SmallImgBlock';

export default class SmallImgBlocks extends Component {
    constructor() {
        super();
    }

    render() {
        let {
            imgsData,
            handleSignInClick
        } = this.props;

        return (
            <div className="headerLine-nav-footer">
                {/* <div class="clearfix"> */}
                <Flex wrap="wrap" justify="between">
                    {
                        imgsData.length ? imgsData.map((imgData, index) => (
                            <SmallImgBlock index={index} handleSignInClick={handleSignInClick} key={"small"+index} pathUrl={imgData.url} imgUrl={imgData.pic} imgName={imgData.name}/>
                        )) : ""
                    }
                </Flex>
                {/* </div> */}
            </div>
        );
    }
}
