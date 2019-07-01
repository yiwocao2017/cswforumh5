const Ajax = require('../util/ajax.js');
const Util = require('../util/util.js');

export const PostCtr = {
    /*
     * 分页获取帖子
     * params: {start,limit, ...}
     */
    getPagePost: (params, refresh) => {
        params.isLock = "0";
        params.status = params.status || "BD";
        params.companyCode = Util.getCompanyCode();
        params.userId = Util.getUserId();
        return Ajax.get("610130", params, refresh);
    },
    /*
     * 分页获取草稿中的帖子
     * params: {start,limit}
     */
    getPageDraftPost: (params, refresh) => {
        params.status = "A";
        params.publisher = Util.getUserId();
        params.orderColumn = "publish_datetime";
        params.orderDir = "desc";
        return Ajax.get("610130", params, refresh);
    },
    /*
     * 分页查询我评论过的帖子
     * params: {start,limit}
     */
    getPageSendCommentPost: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("610138", params, refresh);
    },
    /*
     * 分页查询我被评论过的帖子
     * params: {start,limit}
     */
    getPageReceivedCommentPost: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("610139", params, refresh);
    },
    /*
     * 分页查询我被点赞的帖子
     * params: {start,limit}
     */
    getPageLikePost: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("610141", params, refresh);
    },
    /*
     * 分页查询提到我的帖子
     * params: {start,limit}
     */
    getPageMentionMyPost: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("610144", params, refresh);
    },
    /*
     * 分页查询提到我的评论
     * params: {start,limit}
     */
    getPageMentionMyComment: (params, refresh) => {
        params.userId = Util.getUserId();
        return Ajax.get("610143", params, refresh);
    },
    // 获取帖子详情
    getPostDetail: (code, refresh) => (
        Ajax.get("610132", {
            code,
            userId: Util.getUserId()
        }, refresh)
    ),
    /*
     * 根据关键字分页查询帖子
     * params: {keyword,start,limit}
     */
    getPagePostByKeyword(params, refresh){
        params.isLock = "0";
        params.status = "BD";
        params.companyCode = Util.getCompanyCode();
        return Ajax.get("610130", params, refresh);
    },
    // 普通发布帖子
    publishPost: (params) => (
        Ajax.post("610110", params)
    ),
    // 草稿发布帖子
    publishPostFromDraft: (params) => (
        Ajax.post("610111", params)
    ),
    // 保存到草稿箱
    saveToDraft: (params) => (
        Ajax.post("610110", params)
    ),
    /*
     * 发布评论
     * params: {content,type,parentCode}
     * type: 1针对帖子、2针对评论
     */
    publishComment: (params) => {
        params.commer = Util.getUserId();
        return Ajax.post("610112", params);
    },
    // 阅读帖子
    readPost: (postCode) => (
        Ajax.post("610120", {postCode})
    ),
    /*
     * 分页获取帖子打赏列表
     * params: {postCode,start,limit}
     */
    getPagePostPraise: (params, refresh) => (
        Ajax.get("610142", params, refresh)
    ),
    /*
     * 分页获取评论
     * params: {postCode, start, limit}
     */
    getPageComment: (params, refresh) => {
        params.status = "BD";
        params.orderColumn = "comm_datetime",
        params.orderDir = "desc"
        return Ajax.get("610133", params, refresh);
    },
    /*
     * 分页获取点赞
     * params: {userId,postCode,start,limit}
     * userId: 发帖人
     */
    getPageLike: (params, refresh) => {
        params.orderColumn = "talk_datetime";
        params.orderDir = "desc";
        return Ajax.get("610141", params, refresh);
    },
    // 设置精华或头条
    setJHOrTop: (code, location) => (
        Ajax.post("610117", {
            code,
            location,             //  A置顶 B 精华 C 头条
            updater: Util.getUserId()
        })
    ),
    // 点赞帖子
    dzPost: (postCode) => (
        PostCtr.dzOrScPost(postCode, 1)
    ),
    // 收藏帖子
    scPost: (postCode) => (
        PostCtr.dzOrScPost(postCode, 2)
    ),
    // 打赏帖子
    pricePost: (postCode, amount) => (
        Ajax.post("610122", {
            postCode,
            amount: +amount * 1000,
            userId: Util.getUserId()
        })
    ),
    // 1 点赞 2 收藏
    dzOrScPost: (postCode, type) => (
        Ajax.post("610121", {
            type,
            postCode,
            userId: Util.getUserId()
        })
    ),
    // 删除评论
    deleteComment: (codeList) => (
        PostCtr.deletePostOrComment(codeList, 2)
    ),
    // 删除帖子
    deletePost: (codeList) => (
        PostCtr.deletePostOrComment(codeList, 1)
    ),
    // 删除评论、帖子
    deletePostOrComment: (codeList, type) => (
        Ajax.post("610116", {
            type,
            codeList,
            userId: Util.getUserId()
        })
    ),
    // 举报帖子
    reportPost: (code, reportNote) => (
        PostCtr.reportPostOrComment(code, reportNote, 1)
    ),
    // 举报评论
    reportComment: (code, reportNote) => (
        PostCtr.reportPostOrComment(code, reportNote, 2)
    ),
    // 举报帖子、评论, type 1 帖子 2 评论
    reportPostOrComment: (code, reportNote, type) => (
        Ajax.post("610113", {
            code,
            type,
            reportNote,
            reporter: Util.getUserId()
        })
    ),
    // 帖子审查通过
    passPost: (codeList, approveNote) => (
        PostCtr.checkPost(codeList, 1, approveNote)
    ),
    // 帖子审查不通过
    unPassPost: (codeList, approveNote) => (
        PostCtr.checkPost(codeList, 0, approveNote)
    ),
    // 审查帖子
    checkPost: (codeList, approveResult, approveNote) => (
        Ajax.post("610114", {
            codeList,
            approveResult,
            approveNote,
            approver: Util.getUserId(),
            type: 1     //  1 帖子 2 评论
        })
    ),
    // 帖子点赞
    likePost: (postCode) => (
        Ajax.post("610121", {
            postCode,
            type: "1",
            userId: Util.getUserId()
        })
    ),
    // 分页获取收藏的帖子列表
    getPageCollectionPost: (params, refresh) => {
        params.talker = Util.getUserId();
        return Ajax.get("610136", params, refresh);
    },
    // 列表获取小板块板块信息
    getBlockList: (refresh) => (
        Ajax.get("610049", {
            companyCode: Util.getCompanyCode(),
            statusList: ["1", "2"]
        }, refresh)
    ),
    // 列表获取大板块
    getBigBlockList: (refresh) => (
        Ajax.get("610027", {
            companyCode: Util.getCompanyCode(),
            status: 1,
            orderColumn: "order_no",
            orderDir: "asc"
        }, refresh)
    ),
    // 获取小板块详情
    getBlockDetail: (code, refresh) => (
        Ajax.get("610046", {code}, refresh)
    ),
    // 根据大板块code获取小板块列表
    getBlockByParentCode: (parentCode, refresh) => (
        Ajax.get("610047", {
            parentCode,
            companyCode: Util.getCompanyCode(),
            statusList:["1","2"]
        }, refresh)
    ),
    // 获取版主为当前用户的板块列表
    getBlockByUserId: (refresh) => (
        Ajax.get("610047", {
            userId: Util.getUserId()
        }, refresh)
    )
};
