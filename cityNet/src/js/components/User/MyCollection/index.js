import React, {Component} from 'react';
import {Link} from 'react-router';
import NormalHeader from '../../../components/NormalHeader';
import NormalPostItem from '../../../components/NormalPostItem';
import {globalInfo} from '../../../containers/App';
import Tloader from 'react-touch-loader';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {PostCtr} from '../../../controller/PostCtr';

const Util = require('../../../util/util');

export default class MyCollection extends Component {
    constructor() {
        super();
        this.state = {
            start: 1,
            limit: 10,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now(),

            postData: []
        };
        this.isLoading = false;
    }
    componentDidMount() {
        if(/#\/user\/collection\?/.test(location.href)){
            this.initData();
        }
    }
    componentDidUpdate(){
        if(/#\/user\/collection\?/.test(location.href)){
            if(document.title != "我的收藏"){
                Util.setTitle("我的收藏");
            }
            this.initData();
        }
    }
    // 页面初始化的逻辑代码
    initData(){
        let {initializing} = this.state;
        if(initializing !== 2 && !this.isLoading){
            this.isLoading = true;
            Util.showLoading();
            this.getPagePost(true).then(() => {
                this.setState({initializing: 2});
                this.isLoading = false;
                Util.hideLoading();
            }).catch(()=>{});
            GeneralCtr.recordPageView();
        }
    }
    // 分页获取收藏列表
    getPagePost(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return PostCtr.getPageCollectionPost({
            start,
            limit
        }, refresh).then((data) => {
            let hasMore = data.list.length >= limit || 0;
            let {postData} = this.state;
            postData = refresh && [] || postData;
            postData = [].concat.call(postData, data.list);
            hasMore && start++;
            this.setState({
                hasMore,
                start,
                postData
            });
        });
    }
    handleLoadMore(resolve) {
        this.getPagePost().then(resolve).catch(resolve);
    }
    handleRefresh(resolve) {
        this.getPagePost(true).then(resolve).catch(resolve);
    }
    // 点赞
    handleLikeClick(item){
        let {postData} = this.state,
            index = Util.findItemInArr(postData, item, "code");
        if(index != -1){
            if(item.isDZ == "0"){
                postData[index].isDZ = "1";
                postData[index].sumLike = +item.sumLike + 1;
                postData[index].likeList.push({
                    "talker": Util.getUserId(),
                    "nickname": globalInfo.user.nickname
                });
            }else{
                postData[index].isDZ = "0";
                postData[index].sumLike = +item.sumLike - 1;
                let likeList = postData[index].likeList || [];
                let likeIndex = Util.findItemInArr(likeList, {"talker": Util.getUserId()}, "talker");
                if(likeIndex != -1){
                    likeList.splice(likeIndex, 1);
                }
                postData[index].likeList = likeList;
            }
            this.setState({postData});
        }
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
        let {hasMore, initializing, refreshedAt, postData} = this.state;
        let postItems = postData.length
                ? postData.map((data, index) => (
                    <NormalPostItem
                        key={data.code}
                        pData={data}
                        handleLikeClick={this.handleLikeClick.bind(this)}
                        showCarousel={this.props.showCarousel}
                        toUrl='/user/collection'
                        showComment={true}/>
                ))
                : Util.noData("暂无收藏的帖子");
        return (
            <div>
                <div class="box" style={{
                        display: this.props.children ? "none": ""
                    }}>
                    <NormalHeader title='我的收藏'/>
                    <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                        <div class="rich_list">
                            <ul>{postItems}</ul>
                        </div>
                    </Tloader>
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}
