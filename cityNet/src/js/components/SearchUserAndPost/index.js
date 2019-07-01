import React, {Component} from 'react';
import SearchHeader from './SearchHeader';
import SearchBody from './SearchBody';

const Util = require('../../util/util.js');

export default class SearchUserAndPost extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex: 0
        };
    }
    componentDidUpdate(){
        if(document.title != "搜索"){
            Util.setTitle("搜索");
        }
    }
    handleNavChange(index){
        this.setState({
            activeIndex: index
        });
    }
    // 生成子元素，并传入相关参数
    renderChildren() {
        //遍历所有子组件
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                //把父组件的props赋值给每个子组件
                showCarousel: this.props.showCarousel
            })
        })
    }
    render(){
        let {activeIndex} = this.state;
        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <SearchHeader handleNavChange={this.handleNavChange.bind(this)}/>
                    <div class="tloaderDiv">
                        {
                            <div>
                                <div style={{display: activeIndex == 0 ? "block" : "none"}}>
                                    <SearchBody searchType={0}/>
                                </div>
                                <div style={{display: activeIndex == 1 ? "block" : "none"}}>
                                    <SearchBody
                                        searchType={1}
                                        showCarousel={this.props.showCarousel}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}
