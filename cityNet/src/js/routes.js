import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import App from './containers/App';

const HeadLine = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/HeadLine/index').default)
    }, 'HeadLine');
};
const Rich = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/Rich/index').default)
    }, 'Rich');
};
const PostDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/PostDetail').default)
    }, 'PostDetail');
};
const Forum = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Forum').default)
    }, 'Forum');
};
const ForumBlock = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ForumBlock').default)
    }, 'ForumBlock');
};
const NotFoundPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/404').default)
    }, 'NotFoundPage');
};
const SearchUserAndPost = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/SearchUserAndPost').default)
    }, 'SearchUserAndPost');
};
const WritePost = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/WritePost').default)
    }, 'WritePost');
};
const User = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/User').default)
    }, 'User');
};
const UserPostList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/UserPostList').default)
    }, 'UserPostList');
};
const FansOrAttention = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/FansOrAttention').default)
    }, 'FansOrAttention');
};
const UserSetting = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/UserSetting').default)
    }, 'UserSetting');
};
const UserReward = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/UserReward').default)
    }, 'UserReward');
};
const DraftBox = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/DraftBox').default)
    }, 'DraftBox');
};
const MyCommodityList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MyCommodityList').default)
    }, 'MyCommodityList');
};
const CommodityList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/CommodityList').default)
    }, 'CommodityList');
};
const CommodityDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/CommodityList/CommodityDetail').default)
    }, 'CommodityDetail');
};
const MyCollection = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MyCollection').default)
    }, 'MyCollection');
};
const Message = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Message').default)
    }, 'Message');
};
const CommentList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/CommentList').default)
    }, 'CommentList');
};
const LikeList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/LikeList').default)
    }, 'LikeList');
};
const MentionList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MentionList').default)
    }, 'MentionList');
};
const AttentionUserList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Message/AttentionUserList').default)
    }, 'AttentionUserList');
};
const Login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Login').default)
    }, 'Login');
};
const Register = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Register').default)
    }, 'Register');
};
const ResetPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/ResetPwd').default)
    }, 'ResetPwd');
};
const FindPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/FindPwd').default)
    }, 'FindPwd');
};
const AboutUs = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/AboutUs').default)
    }, 'AboutUs');
};
const ChangeMobile = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/ChangeMobile').default)
    }, 'ChangeMobile');
};
const ChangeLoginName = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/ChangeLoginName').default)
    }, 'ChangeLoginName');
};
const MobileAndPwd = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MobileAndPwd').default)
    }, 'MobileAndPwd');
};
const EditUserInfo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/EditUserInfo').default)
    }, 'EditUserInfo');
};
const UserCenter = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/UserCenter').default)
    }, 'UserCenter');
};
const MyBlock = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MyBlock').default)
    }, 'MyBlock');
};
const MyBlockManage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/MyBlockManage').default)
    }, 'MyBlockManage');
};
const ChatRoom = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/ChatRoom').default)
    }, 'ChatRoom');
};
const PraiseList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/PostDetail/PraiseList').default)
    }, 'PraiseList');
};
const Video = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/Video').default)
    }, 'Video');
};
const IframeWin = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/IframeWin').default)
    }, 'IframeWin');
};
const Pay = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Pay').default)
    }, 'Pay');
};
const Redirect = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Login/Redirect').default)
    }, 'Redirect');
};
const HowToMakeMoney = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/UserReward/HowToMakeMoney').default)
    }, 'HowToMakeMoney');
};
const SysMessage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/User/Message/SysMessage').default)
    }, 'SysMessage');
};


// 活动列表
const Activities = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Activities').default)
    }, 'Activities');
};
// 活动详情
const Activity = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Activity').default)
    }, 'Activity');
};
// 提交活动订单
const ApplyOrder = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/ApplyOrder').default)
    }, 'ApplyOrder');
};
// 支付活动订单
const PayActivity = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/PayActivity').default)
    }, 'PayActivity');
};
// 我的活动订单列表
const OrderList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/Order/OrderList').default)
    }, 'OrderList');
};

export default(
    <Route path="/" component={App}>
        <IndexRedirect to="/home"/>
        <Route path="home" getComponent={HeadLine}>
            <Route path=":code" getComponent={PostDetail}/>
        </Route>

        <Route path="rich" getComponent={Rich}>
            <Route path=":code" getComponent={PostDetail}/>
        </Route>
        <Route path="block" getComponent={Forum}/>
        <Route path="post/:code" getComponent={PostDetail}/>
        <Route path="praise/:code" getComponent={PraiseList}/>

        <Route path="forum" getComponent={ForumBlock}>
            <Route path=":code" getComponent={PostDetail}/>
        </Route>

        <Route path="write" getComponent={WritePost}/>

        <Route path="search" getComponent={SearchUserAndPost}>
            <Route path=":code" getComponent={PostDetail}/>
        </Route>

        <Route path="video" getComponent={Video}>
            <Route path="iframe" getComponent={IframeWin}/>
        </Route>

        <Route path="iframe" getComponent={IframeWin}/>

        <Route path="pay/:code" getComponent={Pay}/>

        <Route path="user">
            <IndexRoute getComponent={User}/>
            <Route path="plist" getComponent={UserPostList}>
                <Route path=":code" getComponent={PostDetail}/>
            </Route>
            <Route path="fansOrAttention/:type" getComponent={FansOrAttention}/>
            <Route path="setting" getComponent={UserSetting}/>
            <Route path="reward" getComponent={UserReward}/>
            <Route path="draft" getComponent={DraftBox}/>
            <Route path="commodity/list" getComponent={MyCommodityList}/>
            <Route path="collection" getComponent={MyCollection}>
                <Route path=":code" getComponent={PostDetail}/>
            </Route>
            <Route path="message" getComponent={Message}/>
            <Route path="comment/list/:type" getComponent={CommentList}/>
            <Route path="like/list" getComponent={LikeList}/>
            <Route path="mention/list/:type" getComponent={MentionList}/>
            <Route path="attention/list" getComponent={AttentionUserList}/>
            <Route path="login" getComponent={Login}/>
            <Route path="register" getComponent={Register}/>
            <Route path="resetPwd" getComponent={ResetPwd}/>
            <Route path="findPwd" getComponent={FindPwd}/>
            <Route path="aboutus" getComponent={AboutUs}/>
            <Route path="changeMobile" getComponent={ChangeMobile}/>
            <Route path="changeLoginName" getComponent={ChangeLoginName}/>
            <Route path="mobileAndPwd" getComponent={MobileAndPwd}/>
            <Route path="editUserInfo" getComponent={EditUserInfo}/>
            <Route path="block" getComponent={MyBlock}/>
            <Route path="block/manage/:code" getComponent={MyBlockManage}/>
            <Route path="chatRoom/:userId" getComponent={ChatRoom}/>
            <Route path="redirect" getComponent={Redirect}/>
            <Route path="aboutJF" getComponent={HowToMakeMoney}/>
            <Route path="sysMessage" getComponent={SysMessage}/>
            <Route path=":userId" getComponent={UserCenter}>
                <Route path=":code" getComponent={PostDetail}/>
            </Route>
        </Route>
        <Route path="mall">
            <Route path="list" getComponent={CommodityList}/>
            <Route path="detail/:code" getComponent={CommodityDetail}/>
        </Route>

        <Route path="activity" getComponent={Activities}>
            <Route path=":code" getComponent={Activity}/>
        </Route>
        <Route path="apply/:code" getComponent={ApplyOrder}/>
        <Route path="actPay/:code" getComponent={PayActivity}/>
        <Route path="orders" getComponent={OrderList}/>


        <Route path="*" getComponent={NotFoundPage}/>
    </Route>
);
