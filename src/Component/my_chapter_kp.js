import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, NavBar, Icon, WhiteSpace, ActivityIndicator, Button, Flex, Modal } from 'antd-mobile';
import { Progress } from 'antd';

import Tex from './renderer.js';

const Item = List.Item;
const Brief = Item.Brief;

class TestResult extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const chapter_id = params.chapter_id;
    if(chapter_id){
      this.props.getChapterStatus(student_id, chapter_id);
      this.props.getChapterKpStatus(student_id, chapter_id);
    }else{
      alert("页面参数错误");
    }
  }

  renderKpList(){
    const {test_kp} = this.props;
    //<Brief>{item.kpid}</Brief>
    return (
        <List renderHeader={() => '相关知识点情况'} >
          {
            test_kp.map((item) => {

              return (
                <Item
                  extra={item.kp_rating}>
                  {item.kpname}
                  
                </Item>
              )
            })
          }
        </List>
    )
  }

  render() {
    var {isFetching, chapter} = this.props;
    console.log(chapter.status);
    var {status, kp} = chapter;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >测试详情</NavBar>
        <div style={{
            textAlign: 'center',
            height: '10rem',
            fontSize: '2rem',
            backgroundColor: 'green',
            color: "white"
          }}>音程</div>
        <WhiteSpace size='lg' />
        <Flex>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{status.practice}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>练习次数</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{status.practice ? status.correct/status.practice : 0}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>正确率</div>
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}

export default connect(state => {
  const studentData = state.studentData.toJS();
  const {isFetching, chapter} = studentData;
  console.log(studentData)
  return {
    chapter: chapter,
    isFetching: isFetching ? isFetching : false,
    student_id:state.AuthData.get('userid'),
  };
}, action)(TestResult);