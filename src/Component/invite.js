import { Tabs, WingBlank, WhiteSpace, List, Toast, InputItem, Button, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';

import *as action from '../Action/reg_action';
import {connect} from 'react-redux';


class Invite extends React.Component {
  constructor(props) { 
    super(props);
    const {code,state} = this.props.location.query;
    console.log('code:'+code);
    console.log('state:'+state);

    if(code){
      this.props.getWxAuth(code,state);
    }
  }

  componentDidMount(){
   
  }

  handleSubmit(e){
    e.preventDefault();
    const {wx_info} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        alert('values.invitationcode:'+values.invitationcode);
        this.props.checkInviCode(wx_info, values.invitationcode);
      }
    });
  }

  render(){
    const {hascode} = this.props;
    const { getFieldProps } = this.props.form;

    if(hascode > -1){
      if(hascode == 0){
        Toast.fail('邀请码错误，请重新输入', 1, ()=>{
            this.props.hideHascodeToast();
        });
      }else if(hascode == 1){
        Toast.success("验证成功", 1, () => {
          this.props.jumptohome();
        });
      }
    }

    return(
      <div style={{margin:'100px auto',padding:'0 20px 20px 20px'}}>
        <form>
          <List>
            <InputItem
              {...getFieldProps('invitationcode', {
                rules: [
                  { required: true, message: '请输入六位邀请码' },
                ],
              })}
              placeholder="请输入六位邀请码"
            >邀请码：</InputItem>
          </List>
        </form>
         <WhiteSpace />
          <WingBlank>
          <div style={{marginTop: '0.5rem'}}>
            <Button type="primary"  onClick={(e)=>this.handleSubmit(e)}>
                提交
            </Button>
            <WhiteSpace />
          </div>
          </WingBlank>
      </div>
    );
    
  }

}

const  InviteWapper = createForm()(Invite);
export default connect(state => {
  const authData = state.AuthData.toJS();
  return {
    hascode: authData.hascode,
    wx_info: authData.wx_info,

  }
}, action)(InviteWapper);