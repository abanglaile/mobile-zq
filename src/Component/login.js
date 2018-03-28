import { Tabs, WingBlank, WhiteSpace, List, InputItem, Button, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import config from '../utils/Config'
import *as action from '../Action/reg_action';
import {connect} from 'react-redux';

let appid = config.appid;
let redirect_uri = config.redirect_uri;


class LoginView extends React.Component {
  constructor(props) { 
    super(props);
    // alert(this.props.location.query.redirect);
    const redirectRoute = this.props.location.query.redirect || '/mobile-zq/mytest';
    this.state = {
      confirmDirty: false,
      username: '',
      password: '',
      redirectTo: redirectRoute,
      wxauth_url :  "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+
        "&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state="+redirectRoute+
        "#wechat_redirect",
    };
  }

  handleSubmitLogin(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('values.userName:'+values.userName);
        console.log('values.password:'+values.password);
        console.log('this.state.redirectTo:'+this.state.redirectTo);
        this.setState({username:values.userName,password:values.password},()=>{
          this.props.loginUser(values.userName, values.password, this.state.redirectTo);
        });
      }
    });
  }


  render() {
    const { getFieldProps } = this.props.form;
    const tabs = [
      { title: '注册'},
      { title: '登录'},
    ];
    
    return (
      <div style={{margin:'0 auto',padding:'0 20px 20px 20px'}}>
        <div style={{margin:'50px 20px 30px 20px',textAlign:'center'}}>
            <img src="/mobile-zq/img/zqmobile_logo.png" style={{width:'180px',height:'81px'}} alt="zqlogo"/>
        </div>
        <ActivityIndicator toast animating={false} />
        
        <Tabs tabs={tabs}
         initialPage={1}>
         <div>  
           <List>
              <InputItem
                placeholder="姓名"
              ></InputItem>
              <InputItem
                type="phone"
                placeholder="手机号"
              ></InputItem>
              <InputItem
                type="password"
                placeholder="密码"
              ></InputItem>
            </List>
         </div>
          
         <div>
            <form>
              <List>
                <InputItem
                  {...getFieldProps('userName', {
                    rules: [
                      { required: true, message: '请输入手机号或姓名' },
                    ],
                  })}
                  placeholder="手机号或姓名"
                ></InputItem>
                <InputItem {...getFieldProps('password')} placeholder="密码" type="password">
                </InputItem>
              </List>
            </form>
            <WhiteSpace />
            <WingBlank>
            <div style={{marginTop: '0.5rem'}}>
              <Button type="primary" onClick={(e)=>this.handleSubmitLogin(e)}>
                  登录
              </Button>
              <WhiteSpace />
              <a style={{ fontSize: '0.3rem'}}>手机验证码登录</a>
            </div>
            </WingBlank>
            <div style={{marginTop:'85px',height:'85px',position:'relative',
                  padding:'35px 10px 0 10px', borderTop: '1px solid #d7d7d7'}}>
              <h3 style={{position: 'absolute',top: '-15px',left: '33%',backgroundColor:'white',
                  padding: '5px 15px', color: '#bfbfbf'}}>其他登录方式</h3>
              <a style={{marginLeft: '25%'}} >
                <img src="/mobile-zq/img/qq.png" style={{width:'42px',height:'42px'}} 
                alt="qq"/>
              </a>
              <a href={this.state.wxauth_url} style={{marginLeft: '23%'}}>
                <img src="/mobile-zq/img/wx.png" style={{width:'42px',height:'42px'}} 
                alt="wx"/>
              </a>

            </div>
         </div>

        </Tabs>
          
        <WhiteSpace />

     

      </div>
    );
  }
}

const  LoginWapper = createForm()(LoginView);
export default connect(state => {
  console.log(state);
  return {
    
  }
}, action)(LoginWapper);