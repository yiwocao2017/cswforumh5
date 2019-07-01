import React, {Component} from 'react';
import {Link} from 'react-router';
import {List, InputItem, Button, Picker, DatePicker, TextareaItem, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import EditInfoHeader from './EditInfoHeader';
import ReactQiniu from '../../Qiniu';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zhCN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import './index.scss';
import {globalInfo} from '../../../containers/App';
import {GeneralCtr} from '../../../controller/GeneralCtr';
import {UserCtr} from '../../../controller/UserCtr';

const Util = require('../../../util/util');
const minDate = moment('1900-01-01 +0800', 'YYYY-MM-DD').utcOffset(8);
const genderData = [
    {
        label: '男',
        value: '1'
    }, {
        label: '女',
        value: '0'
    }
];
const rightIcon = require('../../../../images/_pic.png');
const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxFileSize = 1024 * 1024 * 10;   // 10M

class EditUserInfo extends Component {
    constructor(){
        super();
        this.state = {
            file: "",
            token: '',
            user: {
                userExt: {
                    birthday: moment().utcOffset(8)
                }
            }
        }
    }
    componentDidMount(){
        if(!Util.isLogin()){
            Util.goLogin();
            return;
        }
        Util.showLoading();
        Promise.all([
            this.getQiniuToken(),
            this.getUserInfo()
        ]).then(()=>{
            Util.hideLoading();
        }).catch(() => {});
        GeneralCtr.recordPageView();
    }
    // 获取七牛token
    getQiniuToken(){
        return GeneralCtr.getQiniuToken()
            .then((data) => {
                this.setState({token: data.uploadToken});
            });
    }
    // 获取用户详情
    getUserInfo(){
        if(!globalInfo.user.userId)
            return UserCtr.getUserInfo(true)
                .then((data) => {
                    globalInfo.user = data;
                    let photo = data.userExt.photo, file = "";
                    if(photo){
                        file = {
                            preview: Util.formatUserCenter(data.userExt.photo),
                            key: data.userExt.photo,
                            status: 200
                        }
                    }
                    if(data.userExt.birthday){
                        data.userExt.birthday = moment(data.userExt.birthday, "YYYY-MM-DD").utcOffset(8);
                    }
                    this.setState({user: data, file: file});
                });
        else
            return new Promise((resolve) => {
                if(globalInfo.user.userExt.birthday){
                    globalInfo.user.userExt.birthday = moment(globalInfo.user.userExt.birthday, "YYYY-MM-DD").utcOffset(8);
                }
                let photo = globalInfo.user.userExt.photo, file = "";
                if(photo){
                    file = {
                        preview: Util.formatUserCenter(globalInfo.user.userExt.photo),
                        key: globalInfo.user.userExt.photo,
                        status: 200
                    }
                }
                this.setState({user: globalInfo.user, file: file});
                resolve();
            });
    }
    // 保存用户信息
    saveInfo() {
        this.props.form.validateFields((error, param) => {
            if(!error){
                let {file} = this.state;
                if(file.key && file.status != 200){
                    Toast.info("头像还未上传完成", 1.5);
                    return;
                }
                Util.showLoading("保存中...");
                this.saveExtInfo(param)
                    .then(() => {
                        Util.hideLoading();
                        Util.historyBack();
                    }).catch(() => {});
            }
        });
    }
    // 保存扩展信息
    saveExtInfo(param){
        let {file} = this.state;
        let photo = file.key;
        param.photo = photo;
        param.birthday = param.birthday && param.birthday.format("YYYY-MM-DD") || "";
        param.gender = param.gender[0];
        return UserCtr.saveExtInfo(param)
            .then((data) => {
                globalInfo.user.userExt.nickname = param.nickname;
                globalInfo.user.userExt.photo = photo;
                globalInfo.user.userExt.birthday = param.birthday;
                globalInfo.user.userExt.gender = param.gender;
                globalInfo.user.userExt.email = param.email;
                globalInfo.user.userExt.introduce = param.introduce;
            });
    }
    /*
     * 处理图片上传前的事件
     * @param file    上传图片
     */
    onUpload(file) {
        // set onprogress function before uploading
        file = file[0];
        if(file.size >= maxFileSize){
            return;
        }
        file.onprogress = (e) => {
            file.status = e.srcElement.status;
            this.setState({
                file: file
            });
        };
    }
    /*
     * 处理添加图片事件，把新加入的图片拼到state的files数组里
     * @param new_files    新加入的图片
     */
    onDrop(new_files) {
        let old_file = this.state.file,
            new_file = new_files[0];
        if(new_file.size >= maxFileSize){
            Toast.info('上传的文件大小超出了限制:10M');
            new_file = old_file;
        }
        this.setState({file: new_file});
    }
    /*
     * 处理图片上传错误事件
     * @param error 错误信息
     */
    onUploadError(error) {
        Toast.info(error.body.error, 1.5);
    }
    // textarea的focus事件
    AreaFocus(){
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("introduce");
        setTimeout(() => {
            _context.refs.textarea.scrollIntoView();
        }, 1);
    }
    // email的focus事件
    mailFocus(){
        const {getFieldInstance} = this.props.form;
        let _context = getFieldInstance("email");
        setTimeout(() => {
            _context.refs.input.scrollIntoView();
        }, 1);
    }
    //是否支持继续添加图片
    supportClick(){
        return true;
    }
    render() {
        let {getFieldProps, getFieldError} = this.props.form;
        let {file, token, user} = this.state;
        const QiNiuOpt = {
            onDrop: this.onDrop.bind(this),
            token: this.state.token,
            multiple: false,
            uploadUrl: "http://up-z2.qiniu.com",
            onUpload: this.onUpload.bind(this),
            onError: this.onUploadError.bind(this),
            style: {
                height: '1.9rem',
                width: '100%',
                position: 'relative'
            },
            multiple: false,
            supportClick: this.supportClick.bind(this),
            accept: "image/*"
        };
        let nicknameError, emailError, birthdayError, genderError;
        let birthday = user.userExt.birthday && moment(user.userExt.birthday).utcOffset(8) || zhNow;
        return (
            <div class="box">
                <EditInfoHeader title="编辑" saveInfo={this.saveInfo.bind(this)}/>
                <div class="edit-user-info-wrap border-box tloaderDiv">
                    <List class="bg_fff">
                        <List.Item>
                            <div class="am-list-item pl0">
                                <div class="w50">头像</div>
                                {
                                    token
                                        ?
                                        <ReactQiniu className="edit-user-photo-upload" {...QiNiuOpt}>
                                        {
                                            file && file.preview ? <img src={file.preview}/> : ""
                                        }
                                        </ReactQiniu>
                                        : ""
                                }
                            </div>
                            <div class="right-icon" alt=""></div>
                        </List.Item>
                        <List.Item>
                            <InputItem {...getFieldProps('nickname', {
                                rules: [{
                                    required: true,
                                    message: "不能为空"
                                }],
                                initialValue: user.nickname
                            })} placeholder="昵称">昵称</InputItem>
                            {(nicknameError = getFieldError('nickname'))
                                ? <span class="comment-error-tip">{nicknameError.join(',')}</span>
                                : null}
                        </List.Item>
                        <DatePicker locale={zhCN} mode="date" minDate={minDate} {...getFieldProps('birthday', {
                            initialValue: birthday,
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })}>
                            <List.Item arrow="horizontal">生日
                                {(birthdayError = getFieldError('birthday'))
                                    ? <span class="comment-error-tip more-right-error">{birthdayError.join(',')}</span>
                                    : null}
                            </List.Item>
                        </DatePicker>
                        <Picker data={genderData} cols={1} {...getFieldProps('gender', {
                            initialValue: [user.userExt.gender || "1"],
                            rules: [{
                                required: true,
                                message: "不能为空"
                            }]
                        })} className="forss">
                            <List.Item arrow="horizontal">性别
                                {(genderError = getFieldError('gender'))
                                    ? <span class="comment-error-tip more-right-error">{genderError.join(',')}</span>
                                    : null}
                            </List.Item>
                        </Picker>
                        <List.Item>
                            <InputItem
                                {...getFieldProps('email', {
                                    rules: [{
                                        type: 'email',
                                        message: "格式错误"
                                    }, {
                                        required: true,
                                        message: "不能为空"
                                    }],
                                    initialValue: user.userExt.email || ""
                                })}
                                placeholder="邮箱"
                                onFocus={this.mailFocus.bind(this)}
                            >邮箱</InputItem>
                            {(emailError = getFieldError('email'))
                                ? <span class="comment-error-tip">{emailError.join(',')}</span>
                                : null}
                        </List.Item>
                    </List>
                    <List class="mt10">
                        <TextareaItem
                            {...getFieldProps('introduce', {
                                initialValue: user.userExt.introduce || "",
                            })}
                            title="简介"
                            autoHeight
                            labelNumber={5}
                            placeholder="简介"
                            onFocus={this.AreaFocus.bind(this)}
                        />
                    </List>
                </div>
            </div>
        );
    }
}
export default createForm()(EditUserInfo);
