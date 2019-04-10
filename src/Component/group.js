import { Tabs, WingBlank, NavBar, WhiteSpace, List, Icon, Flex, Toast, InputItem, Button } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;

class Group extends React.Component {
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
        if(values.group){
            if (!err) {
                console.log("values.group:",values.group);
                this.props.addStuGroupId(userid, values.group);
                this.setState({
                    edit:false,
                });
            }
        }
        else{
            Toast.fail('ID不能为空 !!!', 1);
        }
    });
  }

  render(){
    const {group} = this.props;
    const {edit} = this.state;
    const { getFieldProps } = this.props.form;
    var groupDom = [];
    if(group[0].group_id){
        groupDom = group.map((item) => <Item thumb="../../img/me_icon/group.png" arrow="empty">{item.group_name}</Item>);
    }

    return(
      <div> 
        <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={e => {
                this.props.router.push("/mobile-zq/root/percenter")}
            }
        >班级</NavBar>
        <div style={{margin:'2rem auto',padding:'0 20px 20px 20px'}}>
            <form>
            <List renderHeader={() => '已绑定班级分组'}>
                {groupDom}
                {edit ? 
                <InputItem
                    {...getFieldProps('group', {
                        rules: [
                        { required: true, message: '请输入班级ID' },
                        ],
                    })}
                    placeholder="请输入班级ID"
                >班级ID：</InputItem>
                :
                <Item
                    // thumb="../../img/me_icon/addgroup.png"
                    thumb="/mobile-zq/img/me_icon/addgroup.png"
                    arrow="empty"
                    onClick={() => {this.setState({edit:true})}}
                ><span style={{color:'#1296db'}}>添加班级</span></Item>
                }
            </List>
            </form>
            <WhiteSpace />
            <WingBlank>
            {edit ? 
            <div style={{marginTop: '0.5rem'}}>
                <Flex>
                    <Flex.Item>
                        <Button type="primary" size="small" style={{ marginRight: '2rem' }} onClick={(e)=>this.setState({edit:false})}>取消</Button>
                    </Flex.Item>
                    <Flex.Item>
                        <Button type="primary" size='small' style={{ marginLeft: '2rem' }} onClick={(e)=>this.handleSubmit(e)}>保存</Button>
                    </Flex.Item>
                </Flex>
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

const  GroupWapper = createForm()(Group);
export default connect(state => {
  const { userid } = state.AuthData.toJS();
  const { group } = state.studentData.toJS();
  return {
    userid : userid,
    group : group,
  }; 
}, action)(GroupWapper);