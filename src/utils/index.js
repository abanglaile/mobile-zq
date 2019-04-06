import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions,push } from 'react-router-redux';
import config from './Config'

let appid = config.appid;
let redirect_uri = config.redirect_uri;

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
     console.log('response :'+JSON.stringify(response));
     return response.json()
}

// export const requireAuthentication = UserAuthWrapper({
//   authSelector: state => state.AuthData,
//   predicate: AuthData => AuthData.get('isAuthenticated'),
//   failureRedirectPath: '/mobile-zq/login',
//   // redirectAction: push,
//   redirectAction: routerActions.replace,
//   wrapperDisplayName: 'UserIsJWTAuthenticated'
// })

export const requireAuthentication = UserAuthWrapper({
    authSelector: state => {
      // alert("state:"+JSON.stringify(state));
      return (state.AuthData);
    },
  
    predicate: AuthData => {
      //  alert("AuthData:"+JSON.stringify(AuthData));
        return (AuthData.get('isAuthenticated'));
      //   return false;
      },
   
    failureRedirectPath: (state, ownProps) => {
  
      console.log("ownProps.location.query.redirect :",ownProps.location.query.redirect);
      var url = ownProps.location.pathname + ownProps.location.search;
      return url;
  
      },
  //   redirectAction: routerActions.replace,
   redirectAction: (newLoc) => {  
      // alert("newLoc:"+JSON.stringify(newLoc)); 
      window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+
      "&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state="+newLoc.query.redirect+"#wechat_redirect";
   },
    wrapperDisplayName: 'UserIsJWTAuthenticated'
  })
  