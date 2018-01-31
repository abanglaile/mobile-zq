import NetUtil from '../utils/NetUtil'
import {push} from 'react-router-redux'
import config from '../utils/Config'
import jwtDecode from 'jwt-decode';
import { checkHttpStatus, parseJSON } from '../utils';
import axios from 'axios';

// const AppID = 'wx6f3a777231ad1747';
// const AppSecret = '881a3265d13a362a6f159fb782f951f9';


let target = config.server_url;


/*-------------------------------------------------*/
//
export const fetchWxAccessToken = (code) => {
    // let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code';
    let url = target + "/get_wx_access_token";
    return (dispatch) => {
        alert(JSON.stringify(code));
        return axios.get(url,{
                params:{
                   code,
                }
        })
        .then(function (response) {
        dispatch(getWxUserInfoSuccess(response.data));
        alert('success' + JSON.stringify(response));
        })
        .catch(function (error) {
            alert('error' + JSON.stringify(error));
        });
    }
}

const getWxUserInfoSuccess = (json) => {
    return {
        type: "GET_WX_USERINFO_SUCCESS",
        json,
    }
}

