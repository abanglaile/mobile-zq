import { Tabs, WingBlank, NavBar, WhiteSpace, List, Icon, Toast, InputItem, Button, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;

class Name extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
        edit : false,
    }
  }

  componentDidMount(){
   
  }

  handleSubmit(e){
    const {userid} = this.props;
    console.log("userid:",userid);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if(values.realname){
            if (!err) {
                console.log("values.realname:",values.realname);
                this.props.updateStuName(userid, values.realname);
                // this.setState({
                //     edit:false,
                // });
            }
        }
        else{
            Toast.fail('不能为空 !!!', 1);
        }
    });
  }

  render(){
    var {realname} = this.props;
    const {edit} = this.state;
    console.log("realname:",realname);
    // realname = "熊茵";
    const { getFieldProps } = this.props.form;

    return(
      <div> 
        <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={e => {
                this.props.router.push("/mobile-zq/root/percenter")}
            }
        >姓名</NavBar>
        <div style={{margin:'2rem auto',padding:'0 20px 20px 20px'}}>
            <form>
            <List>
                {edit ? 
                <InputItem
                    {...getFieldProps('realname', {
                        rules: [
                        { required: true, message: '请输入真实姓名' },
                        ],
                    })}
                    defaultValue = {realname}
                    placeholder="请输入真实姓名"
                >姓名：</InputItem>
                :
                <InputItem
                    value={realname}
                    editable={false}
                    extra={<a onClick={()=>{this.setState({edit:true})}}><span style={{fontSize:'1rem'}}>修改</span></a>}
                >姓名：</InputItem>
                }
            </List>
            </form>
            <WhiteSpace />
            <WingBlank>
            {edit ? 
            <div style={{marginTop: '0.5rem'}}>
                <Button type="primary" style={{lineHeight:'47px'}} onClick={(e)=>this.handleSubmit(e)}>提交</Button>
                <WhiteSpace />
            </div>
            :
            null
            }
            </WingBlank>
        </div>
      </div> 
    );
    
  }
}

const  NameWapper = createForm()(Name);
export default connect(state => {
  const {userid} = state.AuthData.toJS();
  const student_data = state.studentData.toJS();
  const {realname} = student_data;
  return {
    userid : userid,
    realname: realname,
  }
}, action)(NameWapper);