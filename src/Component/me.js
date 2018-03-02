import { Tabs, WingBlank, WhiteSpace, List, Modal, Button, ActivityIndicator, NavBar ,Icon} from 'antd-mobile';
import {Avatar} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../utils/Config'
import *as action from '../Action/reg_action';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class perCenter extends React.Component {
  constructor(props) { 
    super(props);
  }


  render() {
    const {nickname,imgurl} = this.props; 
    return (
      <div>
        <NavBar
          mode="light"
          // icon={<Icon type="left" />}
          // onLeftClick={() => this.props.router.push("/mobile-zq/Question")}
          >我</NavBar>
        <WhiteSpace />
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
  const {nickname, imgurl} = auth_state;
  return {
    nickname: nickname,
    imgurl: imgurl,
  }; 
}, action)(perCenter);