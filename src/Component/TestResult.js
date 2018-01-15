import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, Result, Icon, WhiteSpace, WingBlank, Badge, ActivityIndicator, Button, Modal, NavBar, Grid, Flex, Progress } from 'antd-mobile';
import { Progress as Circle} from 'antd';

import Tex from './renderer.js';

const Item = List.Item;
const Brief = Item.Brief;

class TestResult extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const test_id = params.test_id;
    if(test_id){
      this.props.getTestResult(student_id, test_id);
      this.props.getTestExercise(student_id, test_id);
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
              var correct_rate = item.practice ? item.correct/item.practice : 0;
              return (
                <Item multipleLine> 
                    {item.kpname}
                    <div style={{display: 'flex', marginTop: '0.5rem', alignItems: 'center'}}>
                      <Progress style={{width: '60%'}} percent={correct_rate} position="normal" />
                      <div style={{fontSize: '1rem', marginLeft: '1rem'}}>{correct_rate}%</div>
                    </div>
                    <Brief><div>练习{item.practice ? item.practice : 0}次</div></Brief>
                  </Item>
              )
            })
          }
        </List>
    )
  }

  jumpToExercise(i){
    this.props.updateExindex(i);
    this.props.router.push("/mobile-zq/Question/");
  }

  renderExerciseList2(){
    const {test_log} = this.props;

    return (
        <div>
        <div style={{marginLeft: '1.5rem'}}>
        <Flex>
          <Flex.Item style={{fontSize: '1rem'}}>{'答题卡(' + test_log.length + '题)'}</Flex.Item>
          <Flex.Item>
            <Flex>
              <Flex.Item>
                <svg width="5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="50%" y="50%" width="0.6rem" height="0.6rem" fill="green" />
                <text dx="68%" dy="80%" fontSize="0.8rem" >正确</text>
                </svg>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
        </div>
        <Grid data={test_log} hasLine={false} onClick={(e, i) => this.jumpToExercise(i)}
            columnNum={5}
            renderItem={(dataItem,i) => (
              <svg width="75px" height="75px" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">

                <circle cx="50%" cy="30%" r="20%" stroke="blue" fill="white" />
                <text dx="45%" dy="37%" fontSize="0.8rem" style={{fill: 'blue'}}>{i+1}</text>
              </svg>
            )} 
        />
        </div>
      );
  }

  render() {
    var {isFetching, correct, test_log} = this.props;
    correct = correct ? correct : 0;
    console.log(correct);
    const accurracy = test_log.length ? correct/test_log.length : 0;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.router.goBack()}
        >测试详情</NavBar>
        <Result
          title={<Circle type="circle" percent={accurracy} />}
          message={<div><span style={{fontSize: '3rem'}} >{correct}</span>{'/' + test_log.length + '题'}</div>}
        />
        {this.renderExerciseList2()}
        <List className="my-list">
          {this.renderKpList()}
        </List>
        <div style={{
            position: 'fixed',
            bottom: '0',
            width: '100%',
            height: "3.8rem",
            zIndex: 100,
            borderTop: "solid 1px #d9d9d9",
            background: "#fff",
            }}>
          <WhiteSpace />
          <WingBlank>
          <Button  type="primary"
            onClick={ e => this.props.router.push("/mobile-zq/mytest/")} >
              继续修炼
          </Button>
          </WingBlank>
        </div>
        <ActivityIndicator animating = {isFetching}/>
      </div>
    );
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  const {test_log, test_kp, correct, isFetching, modalOpen, exercise, exindex} = test_state;
  return {
    exindex: exindex,
    exercise: exercise,
    test_log: test_log ? test_log : [],
    test_kp: test_kp ? test_kp : [],
    correct: correct ? correct : 0,
    isFetching: isFetching ? isFetching : false,
    student_id:state.AuthData.get('userid'),
  };
}, action)(TestResult);