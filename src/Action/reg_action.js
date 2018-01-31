import NetUtil from '../utils/NetUtil'
import {push} from 'react-router-redux'
import config from '../utils/Config'
import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../utils';

const AppID = 'wx6f3a777231ad1747';
const AppSecret = '881a3265d13a362a6f159fb782f951f9';

import axios from 'axios';


/*-------------------------------------------------*/
//
export const fetchWxAccessToken = (code) => {
    // let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code';
    let url = "https://www.kmap.xin/klmanager/get_wx_access_token?code=" + code;

    return (dispatch) => {
        alert(JSON.stringify(code));
        return axios.get(url).then(function (response) {
            alert('success' + JSON.stringify(response));
        })
        .catch(function (error) {
            alert('error' + JSON.stringify(error));
        });
        // NetUtil.get(url, {}, json => {
        //     alert("success" + JSON.stringify(json));
        //     //dispatch(getWxAccessTokenSuccess(json));    
        //     //dispatch(fetchWxUserInfo(json));
        // }, errors => {
        //     alert("errors" + JSON.stringify(errors));
        //     dispatch(getWxAccessTokenError(errors));
        // });
    }
}

const fetchWxUserInfo = (json) => {
    return (dispatch) => {
        let url =  'https://api.weixin.qq.com/sns/userinfo';
        let params = {
                    access_token:json.access_token,
                    openid:json.openid,
                    lang:'zh_CN'
        }
        return NetUtil.get(url, params, json => {
            dispatch(getWxUserInfoSuccess(json));
        }, errors => {
            console.log(errors);
        });
    }
}

const getWxUserInfoSuccess = (json) => {
    return {
        type: "GET_WX_USERINFO_SUCCESS",
        json,
    }
}

const getWxAccessTokenSuccess = (json) => {
  return {
    type: 'GET_ACCESS_TOKEN_SUCCESS',
    json,
  }
}
const getWxAccessTokenError = (errors) => {
  return {
    type: 'GET_ACCESS_ERRORS_SUCCESS',
    errors,
  }
}

