import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, Button, Result, Icon, WhiteSpace, WingBlank, ActivityIndicator, Modal, NavBar, Flex } from 'antd-mobile';
import { Progress } from 'antd';

const Item = List.Item;
const Brief = Item.Brief;

class TestStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const test_id = params.test_id;
    console.log("student_id params:"+student_id+' '+params);
    if(test_id){
      this.props.getTestStatus(student_id, test_id);
      this.props.getTestRankingList(test_id);
      this.props.getStuTestInfo(student_id,test_id);
    }else{
      alert("页面参数错误");
    }
  }

  PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  renderRanking(){
    var {ranking_list} = this.props;
    // ranking_list = [
    //   {
    //     student_name: 'levin',
    //     correct_exercise: 2,
    //     test_time: '10:05',
    //   },
    //   {
    //     student_name: 'fly',
    //     correct_exercise: 1,
    //     test_time: '07:20',
    //   },
    //   {
    //     student_name: 'leaf',
    //     correct_exercise:1,
    //     test_time: '06:01',
    //   },
    //   {
    //     student_name: 'leaf',
    //     correct_exercise:1,
    //     test_time: '06:01',
    //   },
    //   {
    //     student_name: 'leaf',
    //     correct_exercise:3,
    //     test_time: '06:01',
    //   },
    //   {
    //     student_name: 'leaf',
    //     correct_exercise:5,
    //     test_time: '06:01',
    //   }
    // ];
    return (
      <List renderHeader="测试排行榜">
          {
            ranking_list.map((item, i) => {
              console.log("item:"+JSON.stringify(item));
              var t = (Date.parse(item.finish_time) - Date.parse(item.start_time))/1000;
              var min = this.PrefixInteger(parseInt(t/60), 2);
              var sec = this.PrefixInteger(t%60, 2);
              return (
                <Item arrow="horizontal"
                  extra={<div><Icon type="check" />{item.correct_exercise}</div>}>
                  {item.student_name}
                  <Brief>{min + ':' + sec}</Brief>
                </Item>
              )
            })
          }
        </List>
    );
  }

  render() {
    var {isFetching, isFinish, test_id, test_status,student_id} = this.props;
    //TO-DO
    // isFinish = false;
    const buttonStr = isFinish ? '测试记录' : '进入测试';
    // test_status.avg_accurracy = 30;
    // test_status.test_size = 16;
    return (
      <div>
        <NavBar
          mode="light"
          onLeftClick={() => this.props.history.goBack()}
        >测试详情</NavBar>
        <Result
          title={<div><div style={{marginBottom: '0.2rem'}}><b style={{fontSize: '0.4rem', color: 'blue'}}>平均正确率</b></div><Progress type="circle" percent={test_status.avg_accurracy} /></div>}
          message={<div>平均答对<span>{((test_status.avg_accurracy*test_status.test_size)/100).toFixed(1)}</span>题</div>}
        />
        <WhiteSpace size='lg' />
        <Flex>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{test_status.test_submit}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>已提交</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{test_status.test_students}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>参与人数</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{test_status.bingo}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>全对</div>
          </Flex.Item>
        </Flex>
        {this.renderRanking()}
        <WhiteSpace size='lg' />
        <div>
        <div style={{height: "1.2rem"}}></div>
        <div style={{
            position: 'fixed',
            bottom: '0',
            width: '100%',
            height: "3.8rem",
            zIndex: 100,
            borderTop: "solid 1px #d9d9d9",
            background: "#fff",
            }}>
          <span style={{float: 'left', margin: '1rem 0.7rem 0 2rem', fontSize:"1.2rem"}}>测试共{test_status.test_size}条题</span>
          <Button style={{float: 'right', margin: '0.5rem 1.2rem 0 0'}} inline type="primary"
            onClick={ isFinish
              ? e => this.props.router.push("/mobile-zq/TestResult/"+ test_id)  
              : e => this.props.getTestData(student_id, test_id) 
              } >
              {buttonStr}
          </Button>
        </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  const {test_id, isFetching, isFinish, modalOpen, test_status, ranking_list,student_rating} = test_state;
  const default_status = {
    avg_accuracy: 0,
    test_students: 0,
    test_submit: 0,
    bingo: 0,
    test_size: 0,
  }
  console.log(test_state);
  return {
    isFetching: isFetching,
    modalOpen: modalOpen,
    isFinish: isFinish,
    student_rating: student_rating,
    test_status: test_status ? test_status : default_status,
    ranking_list: ranking_list ? ranking_list : [],
    test_id: test_id,
    student_id:state.AuthData.get('userid'),
  };
}, action)(TestStatus);