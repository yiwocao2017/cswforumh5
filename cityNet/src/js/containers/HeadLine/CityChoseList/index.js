import React, {Component} from 'react';
import {List, Flex} from 'antd-mobile';
import Tloader from 'react-touch-loader';
import './index.scss';
const Item = List.Item;
const searchIcon = require("../../../../images/searchIcon.png");

export default class CityChoseList extends Component {
    constructor(){
        super();
        this.state = {
            searchValue: "",
            initializing: 1
        }
    }
    componentDidMount(){
        this.setState({initializing: 2});
    }
    handleChange(event) {
        this.setState({searchValue: event.target.value});
    }
    // 选择城市的click
    handleCityChoseClick(city, e){
        e.preventDefault();
        e.stopPropagation();
        this.props.handleCityChoseClick(city);
    }
    handleChoseCityCancel(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.handleChoseCityCancel();
    }
    render(){
        const {cityListData} = this.props;
        let {searchValue} = this.state;
        let list = [], idx = 0, isCityName = 0;
        for(let category in cityListData){
            let eachList;
            // 如果输入框中有数据，则筛选
            if(searchValue){
                //  如果是拼音首字母
                if(searchValue.length == 1 && /[a-z]/i.test(searchValue) && searchValue.toUpperCase() == category){
                    eachList =
                        <List key={`category${idx++}`} renderHeader={() => category} className="my-list">
                            {
                                cityListData[category].map((city, index) => (
                                    <Item onClick={this.handleCityChoseClick.bind(this, city)} key={`city${index}`} wrap>{city.name}</Item>
                                ))
                            }
                        </List>
                    list.push(eachList);
                    break;
                }else{  // 如果是城市名称
                    eachList = cityListData[category].map((city, index) => {
                        if( city.name.indexOf(searchValue) != -1 ){
                            isCityName = 1;  //  如果是城市名，把isCityName置为1,等最后生成到页面上时加上List作为父标签
                            return <Item onClick={this.handleCityChoseClick.bind(this, city)} key={`city${index}`} wrap>{city.name}</Item>;
                        }
                    })
                }
            }else{
                eachList =
                    <List key={`category${idx++}`} renderHeader={() => category} className="my-list">
                        {
                            cityListData[category].map((city, index) => (
                                <Item onClick={this.handleCityChoseClick.bind(this, city)} key={`city${index}`} wrap>{city.name}</Item>
                            ))
                        }
                    </List>
            }
            list.push(eachList);
        }
        return (
            <div class="city-list-wrap">
                <div class="city-list-header">
                    <Flex justify="center">
                        <Flex.Item>
                            <Flex justify="center">
                                <Flex.Item>
                                    <div class="city-list-flex-left">
                                        <Flex justify="center">
                                            <img class="city-search-icon" src={searchIcon}/>
                                            <Flex.Item><input type="text"  value={this.state.searchValue} onChange={this.handleChange.bind(this)} class="search-input" placeholder="请输入城市名称或拼音首字母"/></Flex.Item>
                                        </Flex>
                                    </div>
                                </Flex.Item>
                                <input type="button" class="city-list-cancel-btn" onClick={this.handleChoseCityCancel.bind(this)} value="取消"/>
                            </Flex>
                        </Flex.Item>
                    </Flex>
                </div>
                <Tloader initializing={this.state.initializing} hasMore={false} className="tloader cityChoseListLoader">
                    {
                        isCityName
                        ? <List>{list}</List>
                        : list
                    }
                </Tloader>
            </div>
        );
    }
}
