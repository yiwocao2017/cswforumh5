import React, {Component} from 'react';
import Tloader from 'react-touch-loader';
import NormalPostItem from '../../../NormalPostItem';

const Ajax = require('../../../../util/ajax');
const Util = require('../../../../util/util');

export default class ManagePostItems extends Component {
    constructor(){
        super();
        this.state = {
            limit: 10,
            start: 1,
            hasMore: 0,
            postData: null,

            company: null,      //当前站点信息
            initializing: 1,    //Tloader初始化状态
            refreshedAt: Date.now()
        }
    }
    componentWillMount(){
        this.setState({company: Util.getCompany()});
    }
    componentDidMount(){
        let {slideIndex} = this.props;
        if(slideIndex == 0)
            this.getLeftPagePost(true).then(() => {
                this.setState({initializing: 2});
            }).catch(() => {});
        else
            this.getRightPagePost(true).then(() => {
                this.setState({initializing: 2});
            }).catch(() => {});
    }
    // 上拉加载更多
    handleLoadMore(resolve) {
        let {slideIndex} = this.props;
        if(slideIndex == 0)
            this.getLeftPagePost().then(resolve);
        else
            this.getRightPagePost().then(resolve);
    }
    // 下拉刷新
    handleRefresh(resolve) {
        let {slideIndex} = this.props;
        if(slideIndex == 0)
            this.getLeftPagePost(true).then(resolve);
        else
            this.getRightPagePost(true).then(resolve);
    }
    // 分页获取待审查帖子
    getLeftPagePost(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return Ajax.get("610130", {
            start,
            limit,
            status: 'CC',
            plateCode: this.props.plateCode
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
    // 分页查询管理的帖子
    getRightPagePost(refresh){
        let {start, limit} = this.state;
        start = refresh && 1 || start;
        return Ajax.get("610130", {
            start,
            limit,
            orderDir: 'desc',
            orderColumn: 'publish_datetime',
            status: 'BD',
            plateCode: this.props.plateCode
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
        })
    }
    // 设置精华或置顶
    setJHOrTop(item, location){
        let {postData} = this.state;
        let index = Util.findItemInArr(postData, item, "code");
        if(index != -1){
            let _item = postData[index];
            _item.location = location;
            postData[index] = _item;
            this.setState({postData});
        }
    }
    // 删除审查帖子的回调
    deleteCheckPost(data){
        let {postData} = this.state;
        postData.splice(Util.findItemInArr(postData, data, "code"), 1);
        this.setState({postData});
    }
    // 通过审查帖子的回调
    passPost(data){
        let {postData} = this.state;
        postData.splice(Util.findItemInArr(postData, data, "code"), 1);
        this.setState({postData});
    }
    // 删除管理帖子的回调
    deleteManagePost(data){
        let {postData} = this.state;
        postData.splice(Util.findItemInArr(postData, data, "code"), 1);
        this.setState({postData});
    }
    render(){
        let {postData, initializing, hasMore} = this.state;
        let {slideIndex} = this.props;
        let option;
        if(slideIndex == 0){
            option = {
                deletePost: this.deleteCheckPost.bind(this),
                passPost: this.passPost.bind(this),
                showCheckBtn: true,
            };
        }else{
            option = {
                setJHOrTop: this.setJHOrTop.bind(this),
                deletePost: this.deleteManagePost.bind(this),
                showManageBtn: true
            };
        }
        return (
            <Tloader initializing={initializing} onRefresh={this.handleRefresh.bind(this)} hasMore={hasMore} onLoadMore={this.handleLoadMore.bind(this)} autoLoadMore={true} className="tloader headNoBottom">
                <div class="rich_list">
                    <ul>{
                        postData && postData.length ? postData.map((data, index) => (
                            <NormalPostItem
                                key={data.code}
                                pData={data}
                                hideLikeIcon={true}
                                showCarousel={this.props.showCarousel}
                                {...option}
                            />
                        )) : Util.noData("暂无帖子")
                    }</ul>
                </div>
            </Tloader>
        );
    }
}
