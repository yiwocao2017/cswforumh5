import React, {Component} from 'react';
import {WhiteSpace, List, TextareaItem, InputItem, Flex, Toast, Modal} from 'antd-mobile';
import {createForm} from 'rc-form';
import ReactQiniu from '../../components/Qiniu';
import WritePostHeader from './WritePostHeader';
import ChoseBlock from './ChoseBlock';
import EmojiGrid from './EmojiGrid';
import AtUserList from './AtUserList';
import {GeneralCtr} from '../../controller/GeneralCtr';
import {PostCtr} from '../../controller/PostCtr';
import './index.scss';

const Util = require('../../util/util');
const Item = Flex.Item;
const breakImg = require('../../../images/break-img.png');
const maxFileSize = 1024 * 1024 * 10;   // 10M

class WritePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 0,
            files: [],              //图片信息，如果是草稿发帖，保存进入这个页面的草稿的pic
            token: '',              //七牛token
            showEmoji: false,       //是否显示表情列表
            showUserList: false,    //是否显示用户列表
            blockTitle: "",         //当前选择的板块的name
            showChoseBlock: false,  //是否显示板块列表
            plateCode: "",          //当前选择的板块的code
            blockData: [],          //板块列表的data
            code: "",               //如果是草稿发帖，保存进入这个页面的草稿的code
            content: "",            //如果是草稿发帖，保存进入这个页面的草稿的content
            title: "",              //如果是草稿发帖，保存进入这个页面的草稿的title
            areaFocus: false,       //textarea是否focus
        }
    }
    componentDidMount(){
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        let {code} = this.props.location.query;
        Util.showLoading();
        if(code){       //草稿发帖
            this.setState({code});
            Promise.all([
                this.getPostByCode(code),
                this.getBlockList(),
                this.getQiniuToken()
            ]).then((values) => {
                let [plateCode, blockData] = values;
                for(let i = 0; i < blockData.length; i++){
                    if(blockData[i].code == plateCode){
                        this.setState({
                            blockTitle: blockData[i].name,
                            plateCode,
                        });
                    }
                }
                this.setState({blockData});
                Util.hideLoading();
            }).catch(() => {});
        }else{
            Promise.all([
                this.getQiniuToken(),
                this.getBlockList()
            ]).then(Util.hideLoading)
            .catch(() => {});
        }
        GeneralCtr.recordPageView();
    }
    // 加载七牛token
    getQiniuToken(){
        return GeneralCtr.getQiniuToken()
            .then((data) => {
                this.setState({token: data.uploadToken});
            });
    }
    // 通过草稿的code获取帖子
    getPostByCode(code){
        return PostCtr.getPostDetail(code)
            .then((data) => {
                let files = [];
                if(data.picArr && data.picArr.length){
                    files = data.picArr.map((pic, index) => (
                        {
                            key: pic,
                            preview: Util.formatThumbanailImg(pic),
                            status: 200
                        }
                    ))
                }
                this.setState({
                    plateCode: data.plateCode,
                    title: data.title,
                    content: data.content,
                    files
                });
                return data.plateCode;
            })
    }
    /*
     * 点击页面头部的选择板块
     */
    handleChoseClick() {
        let {showChoseBlock} = this.state;
        this.setState({
            showChoseBlock: !showChoseBlock
        });
    }
    /*
     * 列表获取板块信息
     */
    getBlockList(){
        return PostCtr.getBlockList()
            .then((data) => {
                let {code} = this.props.location.query;
                if(!code) {
                    let {bankcode} = this.props.location.query;
                    let block = this.getDefaultBlock(data, bankcode);
                    this.setState({
                        plateCode: block && block.code || "",
                        blockTitle: block && block.name || "",
                        blockData: data
                    });
                } else {
                    this.setState({
                        blockData: data
                    });
                }
                return data;
            });
    }
    /*
     * 获取默认板块，若没有设置，则取第一个
     */
    getDefaultBlock(blockArr, bankcode){
        if(blockArr && blockArr.length){
            if(!bankcode){
                for(let i = 0; i < blockArr.length; i++){
                    if(blockArr[i].isDefault == 1){
                        return blockArr[i];
                    }
                }
            }else{
                for(let i = 0; i < blockArr.length; i++){
                    if(blockArr[i].code == bankcode){
                        return blockArr[i];
                    }
                }
            }
            return blockArr[0];
        }
        return null;
    }
    /*
     * 隐藏选择板块列表
     */
    hideChoseBlock() {
        this.setState({showChoseBlock: false});
    }
    /*
     * 处理选择板块的事件
     * @param index    选择的板块在blockData中的数组下标
     */
    handleBlockClick(index) {
        const {blockData} = this.state;
        this.setState({plateCode: blockData[index].code, blockTitle: blockData[index].name, showChoseBlock: false});
    }
    /*
     * 点击发布按钮，发布帖子
     */
    handleSubmit() {
        this.props.form.validateFields((error, param) => {
            if(!error){
                let {plateCode, files}  = this.state;
                if(!plateCode){
                    Toast.info("还未选中板块", 1);
                    return;
                }
                param.plateCode = plateCode;
                param.publisher = Util.getUserId();
                param.isPublish = 1;
                let fileArr = [];
                for(let i = 0; i < files.length; i++){
                    if(files[i].status != 200){
                        Toast.info("图片还未上传完成", 1.5);
                        return;
                    }
                    fileArr.push(files[i].key);
                }
                param.pic = fileArr.join("||");
                Util.showLoading("发布中...");
                let {code} = this.props.location.query;
                if(code){
                    param.code = code;
                    this.publishPostFromDraft(param);
                }else{
                    this.publishPost(param);
                }
            }
        });
    }
    /*
     * 普通发布帖子
     */
    publishPost(param){
        return PostCtr.publishPost(param)
            .then((data) => {
                if(/;filter:true/.test(data.code)){     //帖子中含有关键字，需要审核
                    Toast.info("帖子内容中包含敏感字符", 2);
                    setTimeout(() => {
                        Util.goPath(`/rich`);
                    }, 2e3);
                }else{
                    Toast.success("发布成功", 1);
                    setTimeout(() => {
                        Util.goPath(`/rich`);
                    }, 1e3);
                }
            }).catch(() => {});
    }
    /*
     * 草稿发布帖子
     */
    publishPostFromDraft(param){
        return PostCtr.publishPostFromDraft(param)
            .then((data) => {
                if(/;filter:true/.test(data.code)){     //帖子中含有关键字，需要审核
                    Toast.info("帖子内容中包含敏感字符", 2);
                    setTimeout(() => {
                        Util.goPath(`/rich`);
                    }, 2e3);
                }else{
                    Toast.success("发布成功", 1);
                    setTimeout(() => {
                        Util.goPath(`/rich`);
                    }, 1e3);
                }
            }).catch(() => {});
    }
    /*
     * 处理图片上传前的事件
     * @param files    上传图片
     */
    onUpload(files) {
        const _self = this;
        let _stateFiles = this.state.files;
        let max = 9 - _stateFiles.length;
        for(let i = 0; i < max && i < files.length; i++){
            let file = files[i];
            if(file.size >= maxFileSize){
                continue;
            }
            file.onprogress = (e) => {
                file.status = e.srcElement.status;
                let idx = _self.findFileIndex(file);
                let stateFiles = this.state.files;
                if(idx != -1){
                    stateFiles.splice(idx, 1, file);
                }else{
                    if(stateFiles.length < 9){
                        stateFiles.splice(-1, 1, file);
                    }
                }
                _self.setState({
                    files: stateFiles
                });
            };
        }
    }
    /*
     * 根据file找到在state的files里的下标
     * @param file    需要寻找下标的file
     */
    findFileIndex(file){
        const {files} = this.state;
        for(let i = 0; i < files.length; i++){
            let f = files[i];
            if(f.key == file.key)
                return i;
        }
        return -1;
    }
    /*
     * 处理添加图片事件，把新加入的图片拼到state的files数组里
     * @param new_files    新加入的图片
     */
    onDrop(new_files) {
        let {files} = this.state;
        let filter_files = new_files.filter((file, index) => file.size < maxFileSize);
        if(filter_files.length != new_files.length){
            Toast.info('上传的文件大小超出了限制:10M');
        }
        files = [].concat.call(files, filter_files);
        if(files.length > 9){
            Toast.info("图片最多添加9张", 1);
            files.splice(9);
        }
        this.setState({files: files, showEmoji: false});
    }
    /*
     * 处理图片上传错误事件
     * @param error 错误信息
     */
    onUploadError(error, file) {
        Toast.info(error.body && error.body.error || (error.message + ":10M") || "图片上传出错", 1.5);
    }
    /*
     * 处理图片关闭按钮的点击事件
     * @param index 点击的图片在数组中的下标
     */
    handleImgClose(index, e) {
        e.stopPropagation();
        e.preventDefault();
        let {files} = this.state;
        [].splice.call(files, index, 1);
        this.setState({files});
    }
    /*
     * 处理输入框获取焦点事件,并隐藏表情
     */
    handleTextFocus() {
        this.setState({showEmoji: false});
    }
    /*
     * 处理textarea获取焦点事件,并隐藏表情
     */
    handleAreaFocus() {
        this.setState({
            areaFocus: true,
            showEmoji: false
        });
    }
    /*
     * 处理textarea失去焦点事件,并保存最后一次的焦点位置
     */
    handleTextBlur(){
        this.setState({areaFocus: false});
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("content"),
            textarea = _context.refs.textarea;
        textarea.blur();
        this.savePos(textarea);
    }
    /*
     * 点击表情图标，弹出表情轮播图
     */
    handleEmojiIconClick(e) {
        e.stopPropagation();
        e.preventDefault();
        let {showEmoji} = this.state;
        this.setState({
            showEmoji: !showEmoji,
            areaFocus: false
        });
        this.handleTextBlur();
    }
    /*
     * 处理轮播图里的表情点击事件,并把表情加入textarea中
     * @param el    点击的表情
     * @param index 点击的表情在数组中的下标
     */
    handleEmojiClick(el, index) {
        this.setTextAreaValue(el.text);
    }
    /*
     * 关闭用户选择列表
     */
    handleUserClose(){
        this.setState({
            showUserList: false
        });
    }
    /*
     * 处理联系人列表点击事件,并把选中的用户名加入textarea中
     * @param username    选中的用户名
     */
    handleUserClick(username){
        this.setState({
            showUserList: false
        });
        this.setTextAreaValue("@" + username + " ");
    }
    /*
     * 在最后一次保存的textarea的光标处加入文本内容
     * @param text    文本内容
     */
    setTextAreaValue(text){
        const {setFieldsValue, getFieldValue} = this.props.form;
        let content = getFieldValue("content") || "";
        let {start, end} = this.state;
        let prev = content.substr(0, start),
            suffix = content.substr(end);
        setFieldsValue({
            "content": prev + text + suffix
        });
        if(start != end){
            end = start;
        }
        this.setState({
            start: start + text.length,
            end: end + text.length
        });
    }
    /*
     * 获取并保存textarea光标的位置
     * @param textBox    点击的表情
     */
    savePos(textBox) {
        let config = Util.savePos(textBox);
        this.setState({
            start: config.start,
            end: config.end
        });
    }
    /*
     * 退出发帖页面，判断是否需要保存帖子到草稿箱
     */
    handleClose(){
        let {getFieldsValue} = this.props.form;
        let {plateCode, files}  = this.state;
        let param = this.props.form.getFieldsValue();

        if(param.title || param.content || files.length){
            this.judegSaveDraft();
        }else{
            Util.historyBack();
        }
    }
    // 弹出框询问是否保存草稿箱
    judegSaveDraft(){
        Modal.alert('提示', '是否要保存到草稿箱?', [
            { text: '取消', onPress: () => (Util.historyBack()) },
            { text: '确定', onPress: () => (this.saveToDraft()) }
        ])
    }
    // 保存到草稿箱
    saveToDraft(){
        let {getFieldsValue} = this.props.form;
        this.props.form.validateFields((error, param) => {
            if(!error){
                let {plateCode, files}  = this.state;
                if(!plateCode){
                    Toast.info("还未选中板块", 1);
                    return;
                }
                param.plateCode = plateCode;
                param.publisher = Util.getUserId();
                param.isPublish = 0;
                let fileArr = [];
                for(let i = 0; i < files.length; i++){
                    if(files[i].status != 200){
                        Toast.info("图片还未上传完成", 1.5);
                        return;
                    }
                    fileArr.push(files[i].key);
                }
                param.pic = fileArr.join("||");

                Util.showLoading("保存中...");
                PostCtr.saveToDraft(param)
                    .then(() => {
                        Toast.success("保存成功", 1);
                        setTimeout(Util.historyBack, 1e3);
                    }).catch(() => {});
            }
        });
    }
    // 图片onload
    handleOnLoad(e){
        let {width, height} = e.target;
        if(width < height){
            e.target.className += " wp100";
        }else{
            e.target.className += " hp100";
        }
    }
    //是否支持继续添加图片
    supportClick(){
        let {files} = this.state;
        if(files.length >= 9){
            Toast.info("图片最多添加9张", 1);
            return false;
        }
        return true;
    }
    //点击@显示关注用户列表
    handleShowUser(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            showUserList: true,
            areaFocus: false
        });
        this.handleTextBlur();
    }
    render() {
        const {getFieldProps, getFieldError} = this.props.form;
        let {
            showEmoji,          //是否显示表情列表
            files,              //图片内容
            blockTitle,         //但前选择的板块的name
            blockData,          //板块列表的data
            showChoseBlock,     //是否显示板块列表
            showUserList,       //是否显示用户列表
            token,              //七牛token
            title,              //帖子的初始化title
            content,            //帖子的初始化内容
            plateCode,          //当前选择的板块编号
            areaFocus,          //textarea是否focus
        } = this.state;
        const QiNiuOpt = {
            onDrop: this.onDrop.bind(this),
            token: token,
            uploadUrl: "http://up-z2.qiniu.com",
            onUpload: this.onUpload.bind(this),
            onError: this.onUploadError.bind(this),
            supportClick: this.supportClick.bind(this),
            accept: "image/*"
        }
        return (
            <div>
                <WritePostHeader
                    title={blockTitle}
                    handleChoseClick={this.handleChoseClick.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                    handleClose={this.handleClose.bind(this)}
                />
                <div style={{
                    height: "0.88rem"
                }}></div>
                <WhiteSpace size="sm"/>
                <div className="write-post-form">
                    <List className="pop-over-write-comment-content write-post-list">
                        <InputItem {...getFieldProps('title', {
                            rules: [{required: true}],
                            initialValue: title
                        })} clear placeholder="标题" onFocus={this.handleTextFocus.bind(this)}/> {getFieldError('title')
                            ? <span class="comment-error-tip">标题不能为空</span>
                            : null}
                    </List>
                    <List className="pop-over-write-comment-content write-post-no-bottom">
                        <TextareaItem
                            {...getFieldProps('content', {
                                rules: [{required: true}],
                                initialValue: content
                            })}
                            rows={6}
                            focused={areaFocus}
                            placeholder="帖子内容"
                            onFocus={this.handleAreaFocus.bind(this)}
                            onBlur={this.handleTextBlur.bind(this)}
                        /> {getFieldError('content')
                            ? <span class="comment-error-tip">帖子内容不能为空</span>
                            : null}
                    </List>
                    <List className="pop-over-write-comment-content">
                        <Flex className="comment-flex">
                            <Item className="comment-flex-item">
                                {token
                                    ?<ReactQiniu {...QiNiuOpt}>
                                        <div class="photo-icon"></div>
                                    </ReactQiniu> : ""}
                            </Item>
                            <Item onClick={this.handleShowUser.bind(this)} className="comment-flex-item">
                                <div class="at-icon"></div>
                            </Item>
                            <Item className="comment-flex-item" onClick={this.handleEmojiIconClick.bind(this)}>
                                <div class="emoji-icon"></div>
                            </Item>
                        </Flex>
                    </List>
                    {showEmoji
                        ? <EmojiGrid handleEmojiClick={this.handleEmojiClick.bind(this)}/>
                        : ""}
                    {files.length
                        ? <Flex class="write-post-img-wrap" wrap="wrap">
                                {files.map((file, index) => (
                                    <div key={`index${index}`} class="write-post-img">
                                        <div class="write-post-img-div">
                                            {
                                                file.status ?
                                                    (file.status == 200
                                                        ? <img class="preview-center" onLoad={this.handleOnLoad.bind(this)} src={file.preview}/>
                                                        : <img class="break-img" src={breakImg}/>)
                                                    :
                                                    (<div>
                                                        <img class="preview" src={file.preview}/>
                                                        <div class="center-loading"><i class="loading"></i></div>
                                                    </div>)
                                            }
                                            <i class="img-close" onClick={this.handleImgClose.bind(this, index)}></i>
                                        </div>
                                    </div>
                                ))}
                                {files.length < 9 ?
                                    <ReactQiniu className="write-post-img-upload" {...QiNiuOpt}>
                                        <div class="photo-add-icon"></div>
                                    </ReactQiniu>
                                    : ""
                                }
                            </Flex>
                        : ""}
                </div>
                {showChoseBlock
                    ? <ChoseBlock plateCode={plateCode} hideChoseBlock={this.hideChoseBlock.bind(this)} handleBlockClick={this.handleBlockClick.bind(this)} blockData={blockData}/>
                    : ""}
                {showUserList
                    ? <AtUserList handleUserClick={this.handleUserClick.bind(this)} handleUserClose={this.handleUserClose.bind(this)}/>
                    : ""}
            </div>
        )
    }
}
export default createForm()(WritePost);
