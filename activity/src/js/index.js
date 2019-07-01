import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';
import Root from './Root';
import 'antd-mobile/dist/antd-mobile.min.css';
import '../css/global.scss';
import 'normalize.css';
const rootEl = document.getElementById('mainContainer');

ReactDOM.render(
    <Root history={hashHistory}/>, rootEl);
