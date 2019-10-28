import Immutable from 'immutable';
import jwtDecode from 'jwt-decode';

const defaulatAuthData = Immutable.fromJS({
        token: null,
        nickname: null,
        imgurl:null,
        // userid: 4,
        // userid : 'bbc7c060041711e98175d1610e288342',
        userid : 'f988a0f0036211e98175d1610e288342',
        student_name:null,
        realname:null,
        class_name:null,
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
        // case 'REG_USER_REQUEST':
        //     return state.set('isAuthenticating', true);
        case 'LOGIN_USER_SUCCESS':
            console.log("action.token:",action.token);
            var obj = JSON.parse(action.token);
            console.log("action username:",obj.identifier);
            console.log("action userid:",obj.userid);
            return state.set('isAuthenticating', false)
                    .set('isAuthenticated',true)
                    .set('username',obj.identifier)
                    .set('userid',obj.userid);
                    
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
                    .set('userName',null)
                    .set('userid',null)
                    .set('statusText','You have been successfully logged out.');
                    
        case 'LOGOUT_WX_USER':
            return state.set('isAuthenticated', false)
                    .set('nickname',null)
                    .set('userid',null)
                    .set('imgurl',null)
                    .set('hascode',null)
                    .set('statusText','You have been successfully logged out.');

        case 'GET_WX_USERINFO_SUCCESS':
                    // console.log("action.token:",action.token);
            var obj = JSON.parse(action.token);
            console.log("userid:",obj.userid);
            console.log("realname:",obj.realname);
            return state.set('isAuthenticating', false)
                    .set('isAuthenticated',true)
                    .set('userid',obj.userid)
                    .set('nickname',obj.nickname)
                    .set('imgurl',obj.imgurl)
                    .set('realname',obj.realname);
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

