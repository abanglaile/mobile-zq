import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, Result, Icon, WhiteSpace, ActivityIndicator, Button, Flex, Modal } from 'antd-mobile';
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
    const test_id = params.test_id;
    if(test_id){
      this.props.getTestResult(student_id, test_id);
      this.props.getTestExercise(student_id, test_id);
    }else{
      alert("页面参数错误");
    }
  }

  renderModal(){
    const defaultExercise = {
      title: '',
      exercise_id: '',
    };
    var {modalOpen, exercise_sample} = this.props;
    exercise_sample = exercise_sample ? exercise_sample : defaultExercise;
    return (
      <Modal
          title="题目"
          transparent
          maskClosable={false}
          visible={modalOpen}
          footer={[
                    { text: '取消', onPress: () => this.props.closeModal() },
                    { text: '重做', onPress: () => this.props.jumpToExercise(exercise_sample.exercise_id) },
                  ]}
        >
          <Tex content={exercise_sample.title} />
      </Modal>
    )
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

  renderExerciseList(){
    const {test_log, correct_time} = this.props;
    var c_hour = this.PrefixInteger(parseInt(correct_time/3600), 2);
    var c_min = this.PrefixInteger(parseInt(correct_time%3600/60), 2);
    var c_sec = this.PrefixInteger(correct_time%3600%60, 2);
    return (
        <List renderHeader={() => '答对耗时：' + c_hour + ':' + c_min + ':' + c_sec}>
          {
            test_log.map((item, i) => {
              var t = (Date.parse(item.finish_time) - Date.parse(item.start_time))/1000;
              var min = this.PrefixInteger(parseInt(t/60), 2);
              var sec = this.PrefixInteger(t%60, 2);

              return (
                <Item style={{backgroundColor: "#fcdbc9"}} arrow="horizontal"                  
                  onClick={e => this.props.getExerciseSample(item.exercise_id)}
                  extra={item.exercise_state ? min + ':' + 'sec' : ''}>
                  <div style={{fontSize: "0.5rem"}}>{i+1}<span style = {{fontSize: "0.1rem", color: "#CCC"}}> 难度系数：506</span></div>
                  <Brief>{<Tex content="求 $sin6^{\circ} sin42^{\circ} sin66^{\circ} sin78^{\circ}$的值。" />}</Brief>
                </Item>
              )
            })
          }
        </List>
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
          onLeftClick={() => this.props.history.goBack()}
        >测试详情</NavBar>
        <Result
          title={<div><div style={{marginBottom: '0.2rem'}}><b style={{fontSize: '0.4rem', color: 'blue'}}>音程</b></div>}
          message={<div>平均答对<span>{((test_status.avg_accurracy*test_status.test_size)/100).toFixed(1)}</span>题</div>}
        />
        <WhiteSpace size='lg' />
        <Flex>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '0.4rem',
                  lineHeight: '0.4rem',
                  width: '100%',
                  fontSize: '0.4rem',
                }} >{test_status.test_submit}</div>
                <div style={{
                  textAlign: 'center',
                  height: '0.5rem',
                  lineHeight: '0.5rem',
                  width: '100%',
                  fontSize: '0.3rem',
                  color: '#00FFFF',
                }}>练习次数</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '0.4rem',
                  lineHeight: '0.5rem',
                  width: '100%',
                  fontSize: '0.4rem',
                }} >{test_status.test_students}</div>
                <div style={{
                  textAlign: 'center',
                  height: '0.5rem',
                  lineHeight: '0.4rem',
                  width: '100%',
                  fontSize: '0.3rem',
                  color: '#00FFFF',
                }}>正确率</div>
          </Flex.Item>
        </Flex>
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