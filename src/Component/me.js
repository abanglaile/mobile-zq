import { Tabs, WingBlank, WhiteSpace, List, Modal, Button, ActivityIndicator, NavBar ,Icon} from 'antd-mobile';
import {Avatar} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../utils/Config'
import *as reg_action from '../Action/reg_action';
import *as inreg_action from '../Action/';
import {connect} from 'react-redux';

const action =Object.assign({},reg_action,inreg_action);

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class perCenter extends React.Component {
  constructor(props) { 
    super(props);
  }

  componentDidMount(){
    const {student_id} = this.props;
    this.props.setSelectedTab("yellowTab");
    this.props.getStudentInfo(student_id);
  }


  render() {
    const {nickname,imgurl,student_name,class_name} = this.props; 
    return (
      <div>
        <NavBar
          mode="dark"
          style = {{backgroundColor:"#1890ff"}}
          >我</NavBar>
        <List>
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => {}}
          >
            <div style={{width:'40px', height:'40px', borderRadius:'50%',overflow:"hidden", margin:"1.6rem 1rem 1.6rem 0",float:'left',display:'inline'}}>
             <img src={imgurl} style={{width:'40px',height:'40px'}}/>
            </div>
            <div style={{float:'left',display:'inline',marginTop:"2rem"}}>{nickname}</div>
          </Item>
          <Item
            arrow="horizontal"
            extra={student_name}
          >
            姓名
          </Item>
          <Item
            arrow="horizontal"
            extra={class_name? class_name:'未绑定'}
          >
            班级
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Item
            arrow="horizontal"
             onClick={() => alert('确定退出该账号吗？','', [
              { text: '取消', onPress: () => console.log('cancel') },
              { text: '确定', onPress: () => this.props.logoutwxAndRedirect() },
            ])}
            align="middle"
          >
            退出登录 
        </Item>
        </List>
      </div>
    );
  }
}

export default connect(state => {
  const auth_state = state.AuthData.toJS();
  const {userid,nickname} = auth_state;
  const student_data = state.studentData.toJS();
  const {student_name,class_name,imgurl} = student_data;
  console.log("student_name,class_name:"+student_name+' '+class_name);
  return {
    student_id:userid,
    imgurl: imgurl,
    nickname: nickname,
    student_name: student_name,
    class_name:class_name,
  }; 
}, action)(perCenter);