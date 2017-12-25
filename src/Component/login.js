import { Tabs, WingBlank, WhiteSpace, List, InputItem, Button, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';

import *as action from '../Action/';
import {connect} from 'react-redux';


class LoginView extends React.Component {
  constructor(props) { 
    super(props);
    alert(window.innerWidth);
    const redirectRoute = this.props.location.query.redirect || '/mobile-zq/mytest';
    this.state = {
      confirmDirty: false,
      username: '',
      password: '',
      redirectTo: redirectRoute
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
      <div>
        <div style={{ textAlign: 'center', margin: '2rem 0 0 0 auto', height: '3rem', backgroundColor: '#fff', fontSize: '1rem' }}>
            知秋 
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