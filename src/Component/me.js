import { Tabs, WingBlank, WhiteSpace, List, Modal, Button, ActivityIndicator, NavBar ,Icon} from 'antd-mobile';
import {Avatar} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../utils/Config'
import *as reg_action from '../Action/reg_action';
import *as inreg_action from '../Action/';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class perCenter extends React.Component {
  constructor(props) { 
    super(props);
  }

  componentDidMount(){
    var {student_id} = this.props;
    // student_id = 'bbc7c060041711e98175d1610e288342';
    this.props.inreg_action.setSelectedTab("yellowTab");
    this.props.inreg_action.getStudentInfo(student_id);
  }


  render() {
    const {realname,imgurl,group,score} = this.props; 
    return (
      <div>
        <NavBar
          mode="light"
          >我</NavBar>
        <List>
          <Item
            arrow="empty"
            multipleLine
            onClick={() => {}}
          >
            <div style={{width:'40px', height:'40px', borderRadius:'50%',overflow:"hidden", margin:"1.6rem 1rem 1.6rem 0",float:'left',display:'inline'}}>
             {/* <img src={imgurl} style={{width:'60px',height:'60px'}}/> */}
              <Avatar size='large' src={imgurl} />
            </div>
            {/* <div style={{float:'left',display:'inline',marginTop:"2rem"}}>{realname}</div> */}
          </Item>
          <Item
            arrow="empty"
            extra={score}
            // thumb="../../img/me_icon/score.png"
            thumb="/mobile-zq/img/me_icon/score.png"
          >
            积分
          </Item>
          <Item
            arrow="horizontal"
            extra={realname}
            // thumb="../../img/me_icon/name.png"
            thumb="/mobile-zq/img/me_icon/name.png"
            onClick={() => this.props.router.push("/mobile-zq/name")}
          >
            姓名
          </Item>
          <Item
            arrow="horizontal"
            extra={group[0].group_id ? '查看班级':'未绑定'}
            // thumb="../../img/me_icon/class.png"
            thumb="/mobile-zq/img/me_icon/class.png"
            onClick={() => this.props.router.push("/mobile-zq/group")}
          >
            班级
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Item
            arrow="horizontal"
            // thumb="../../img/me_icon/quit.png"
            thumb="/mobile-zq/img/me_icon/quit.png"
            onClick={() => alert('确定退出该账号吗？','', [
              { text: '取消', onPress: () => console.log('cancel') },
              { text: '确定', onPress: () => this.props.reg_action.logoutwxAndRedirect() },
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
  const {userid} = auth_state;
  const student_data = state.studentData.toJS();
  const {realname,group,score,imgurl} = student_data;
  // console.log("auth_state:",JSON.stringify(auth_state));
  return {
    student_id:userid,
    imgurl: imgurl,
    realname: realname,
    score : score,
    group : group,
  }; 
},  (dispatch, ownProps) => {
  return{
       reg_action : bindActionCreators(reg_action,dispatch),
       inreg_action : bindActionCreators(inreg_action,dispatch)
  };
})(perCenter);