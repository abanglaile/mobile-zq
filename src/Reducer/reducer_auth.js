import Immutable from 'immutable';
import jwtDecode from 'jwt-decode';

const defaulatAuthData = Immutable.fromJS({
        token: null,
        nickname: null,
        imgurl:null,
        userid: null,
        student_name:null,
        hascode: null, 
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: null,
        wx_info : null,
    });

//获取鉴权数据
export const AuthData = (state = defaulatAuthData, action = {}) => {
    switch(action.type){
        case 'LOGIN_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'REG_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'LOGIN_USER_SUCCESS':
            var sucState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: jwtDecode(action.payload.token).username,
                userid: jwtDecode(action.payload.token).userid,
                statusText: 'You have been successfully logged in.'
            };
            return Immutable.fromJS(sucState);
        case 'REG_USER_SUCCESS':
            var sucRegState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: jwtDecode(action.payload.token).username,
                userid: jwtDecode(action.payload.token).userid,
                statusText: 'You have been successfully registered.'
            };
            return Immutable.fromJS(sucRegState);
        case 'LOGIN_USER_FAILURE':
            var failState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failState);
        case 'REG_USER_FAILURE':
            var failRegState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failRegState);
        case 'LOGOUT_USER':
            return state.set('isAuthenticated', false)
                    .set('token',null)
                    .set('userName',null)
                    .set('userid',null)
                    .set('statusText','You have been successfully logged out.');
                    
        case 'LOGOUT_WX_USER':
            return state.set('isAuthenticated', false)
                    .set('token',null)
                    .set('nickname',null)
                    .set('userid',null)
                    .set('imgurl',null)
                    .set('hascode',null)
                    .set('statusText','You have been successfully logged out.');

        case 'GET_WX_USERINFO_SUCCESS':
            var sucState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                nickname: jwtDecode(action.payload.token).nickname,
                userid: jwtDecode(action.payload.token).userid,
                imgurl:jwtDecode(action.payload.token).imgurl,
                student_name:jwtDecode(action.payload.token).name,
                hascode: -1,
                statusText: 'You have been successfully logged in by wx.'
            };
            return Immutable.fromJS(sucState);
        case 'CHECK_CODE_SUCCESS':
            return state.set('hascode',1);
        case 'CHECK_CODE_FAILURE':
            return state.set('hascode',0);
        case 'HIDE_HASCODE_TOAST':
            return state.set('hascode',-1);
        case 'SAVE_TEMP_WX_INFO':
            return state.set('wx_info',Immutable.fromJS(action.wx_info));
        default:
            return state;
    }
} 

