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

export const getWxUserInfoSuccess = (token) => {
    localStorage.setItem('token', token);
    return {
        type: "GET_WX_USERINFO_SUCCESS",
        payload: {
          token: token
        }
    }
}
const saveTempWxInfo = (wx_info) => {
    return {
        type: "SAVE_TEMP_WX_INFO",
        wx_info,
    }
}

const checkCodeSucess = () => {
    return {
        type: "CHECK_CODE_SUCCESS",
    }
}

const checkCodeFailure = () => {
    return {
        type: "CHECK_CODE_FAILURE",
    }
}

export const hideHascodeToast = () => {
    return {
        type: 'HIDE_HASCODE_TOAST',
    }
}

export const jumptohome = () => {
    return (dispatch) => {
        dispatch(push("/mobile-zq/mytest"));
    }
}

export const getWxAuth = (code,state) => {
    // let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code';
    let url = target + "/get_wx_auth";
    return (dispatch) => {
        alert(JSON.stringify(code));
        return axios.get(url,{
                params:{
                   code,
                   state,
                }
        })
        .then(function (response) {
            // let decoded = jwtDecode(response.data.token);
            // alert('decoded:'+JSON.stringify(decoded));  
            // console.log('getWxAuth response.data:'+JSON.stringify(response.data));
            if(response.data.newuser){
                alert('newuser');  
                alert('wx_info:'+JSON.stringify(response.data.wx_info));  
                // dispatch(getWxUserInfoSuccess(response.data.token));
                dispatch(saveTempWxInfo(response.data.wx_info));
            }else{
                alert('olduser');
                dispatch(getWxUserInfoSuccess(response.data.token));
                dispatch(push(response.data.redirect_uri));
            }
        })
        .catch(function (error) {
            alert('error getWxAuth' + JSON.stringify(error));
        });
    }
}



export const checkInviCode = (wx_info,invitationcode) => {
    let url = target + "/check_invi_code";
    return (dispatch) => {
        return axios.post(url,{wx_info,invitationcode})
        .then(function (response) {
            alert('checkInviCode response.data:'+JSON.stringify(response.data));
            if(response.data.hascode){
                dispatch(getWxUserInfoSuccess(response.data.token));
                dispatch(checkCodeSucess());
                dispatch(push("/mobile-zq/mytest"));
            }else{
                dispatch(checkCodeFailure());
            }
        })
        .catch(function (error) {
            alert('error checkInviCode' + JSON.stringify(error));
        });
    }
}

