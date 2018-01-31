import { Tabs, WingBlank, WhiteSpace, List, InputItem, Button, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';

import *as action from '../Action/reg_action';
import {connect} from 'react-redux';


class Register extends React.Component {
  constructor(props) { 
    super(props);
    const {code,state} = this.props.location.query;
    console.log('code:'+code);
    if(code){
      this.props.fetchWxAccessToken(code);
    }
  }

  componentDidMount(){
    
  }

  render(){
    const {wxinfo,accjson,accerrors} = this.props;
    if(accjson){
      return(
        <div>
          <div>hello wx</div>

          <div>accjson.access_token:</div>
          <div>{accjson.access_token}</div>
  
        </div>
      );
    }else{
      return(
        <div>
          <div>hello wx</div>
          <div>wxinfo:</div>
          <div>成功</div>
          <div>accjson:</div>
          <div>{accjson}</div>
          <div>失败</div>
          <div>accerrors:</div>
          <div>{accerrors}</div>
        </div>
      );
    }
    
  }

}

export default connect(state => {
  const authData = state.AuthData.toJS();
  return {
    wxinfo: authData.wxinfo,
    accjson: authData.accjson,
    accerrors: authData.accerrors,
  }
}, action)(Register);