import React, {Component} from 'react';
import {Link} from 'react-router';
import Tloader from 'react-touch-loader';
import className from 'classnames';
import {ActivityIndicator, SearchBar} from 'antd-mobile';
import SearchUserBodyItem from './SearchUserBodyItem';
import NormalPostItem from '../../NormalPostItem';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';
import {PostCtr} from '../../../controller/PostCtr';
import './index.scss';

const Util = require('../../../util/util');

export default class SearchBody extends Component {
    constructor(props){
        super(props);
        this.state = {
            limit: 20,
            start: 1,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            searchValue: "",
            searchData: []
        };
    }
    componentDidMount(){
        this.setState({initializing: 2});
        GeneralCtr.recordPageView();
    }
    handleSubmit(value){
        this.setState({searchValue: value})
        let {searchType} = this.props;
        if(searchType == 0){
            this.getPageUserByNickName(value, true);
        }else{
            this.getPagePostByKeyword(value, true);
        }
    }
    // 根据关键字分页查询用户
    getPageUserByNickName(nickname, refresh = false){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return UserCtr.getPageUserByNickName({
            nickname,
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {searchData} = this.state;
            searchData = refresh && [] || searchData;
            searchData = [].concat.call(searchData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                searchData
            });
        });
    }
    // 根据关键字分页查询帖子
    getPagePostByKeyword(keyword, refresh = false){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPagePostByKeyword({
            keyword,
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {searchData} = this.state;
            searchData = refresh && [] || searchData;
            searchData = [].concat.call(searchData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                searchData
            });
        });
    }
    // 下拉加载更多
    handleLoadMore(resolve){
        let {searchValue} = this.state;
        let {searchType} = this.props;
        if(searchType == 0){
            this.getPageUserByNickName(searchValue).then(resolve).catch(resolve);
        }else{
            this.getPagePostByKeyword(searchValue).then(resolve).catch(resolve);
        }
    }
    // 点赞
    handleLikeClick(item){
        let {searchData} = this.state,
            index = Util.findItemInArr(searchData, item, "code");
        if(index != -1){
            if(item.isDZ == "0"){
                searchData[index].isDZ = "1";
                searchData[index].sumLike = +item.sumLike + 1;
                searchData[index].likeList.push({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname
                });
            }else{
                searchData[index].isDZ = "0";
                searchData[index].sumLike = +item.sumLike - 1;
                let likeList = searchData[index].likeList || [];
                let likeIndex = Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker");
                if(likeIndex != -1){
                    likeList.splice(likeIndex, 1);
                }
                searchData[index].likeList = likeList;
            }
            this.setState({searchData});
        }
    }
    render(){
        let {searchType} = this.props;
        let {searchData, hasMore, initializing} = this.state;
        return (
            <div class="search-bar-wrap">
                <SearchBar
                    placeholder="请输入搜索关键词"
                    onSubmit={this.handleSubmit.bind(this)}
                />
                <div>
                    <Tloader
                        initializing={initializing}
                        hasMore={hasMore}
                        onLoadMore={this.handleLoadMore.bind(this)}
                        autoLoadMore={true}
                        className="tloader searchLoader">
                    {
                        searchType == "0"
                            ?
                            <div class="search_user_list">
                                <ul>
                                    {
                                        searchData.length
                                            ? searchData.map((data, index) => (
                                                <SearchUserBodyItem key={data.userId} uData={data}/>
                                            ))
                                            : Util.noData("暂无相关用户")
                                    }
                                </ul>
                            </div>
                            :
                                searchData.length
                                    ?
                                    <div class="rich_list">
                                        <ul>
                                            {
                                                searchData.map((data, index) => (
                                                    <NormalPostItem
                                                        key={data.code}
                                                        pData={data}
                                                        handleLikeClick={this.handleLikeClick.bind(this)}
                                                        showCarousel={this.props.showCarousel}
                                                        toUrl='/search'
                                                    />
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    : Util.noData("暂无相关帖子")
                    }
                    </Tloader>
                </div>
            </div>
        );
    }
}
