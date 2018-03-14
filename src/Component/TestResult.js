import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, Result, Icon, WhiteSpace, WingBlank, Badge, ActivityIndicator, Button, Modal, NavBar, Grid, Flex, Progress, SegmentedControl } from 'antd-mobile';
import { Progress as Circle} from 'antd';

import Tex from './renderer.js';

const Item = List.Item;
const Brief = Item.Brief;

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

class TestResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      segmentedIndex: 0,
    }
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const test_id = params.test_id;
    if(test_id){
      this.props.getTestStatus(student_id, test_id);
      this.props.getTestRankingList(test_id);
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
        <List>
          <Item style={{fontSize: '1.5rem', fontWeight: 'bold'}}>相关知识点</Item>
          <Item extra='更多' onClick={() => 
                this.setState({modal: true})
              } arrow="horizontal">
            <div>{test_kp[0] ? test_kp[0].kpname : ''}</div>
            <Brief>
              <div>
                <span>掌握度： </span>
                <span style={{color: '#1890ff', fontSize: '1.5rem'}}>{test_kp[0] ? test_kp[0].kp_rating : ''}</span>
              </div>
            </Brief>
          </Item>
          
        </List>
    )
  }

  jumpToExercise(i){
    this.props.updateExindex(i);
    this.props.router.push("/mobile-zq/question/");
  }

  renderExerciseList2(){
    const {exercise_log} = this.props;
    return (
        <div>
        <div style={{marginLeft: '1rem'}}>
        <Flex>
          <Flex.Item style={{
            color: 'black',
            fontSize: '1rem', fontWeight: 'bold',
          }}>{'答题卡(' + exercise_log.length + '题)'}</Flex.Item>
          <Flex.Item>
            <Flex>
              <Flex.Item>
                <svg width="5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="50%" y="50%" width="0.6rem" height="0.6rem" fill="green" />
                <text dx="68%" dy="80%" fontSize="0.8rem" >正确</text>
                </svg>
              </Flex.Item>
              <Flex.Item>
                <svg width="5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="20%" y="50%" width="0.6rem" height="0.6rem" fill="red" />
                <text dx="38%" dy="80%" fontSize="0.8rem" >错误</text>
                </svg>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
        </div>
        <Grid data={exercise_log} hasLine={false} onClick={(e, i) => this.jumpToExercise(i)}
            columnNum={5}
            renderItem={(dataItem,i) => (
              <svg width="75px" height="75px" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">

                <circle cx="50%" cy="30%" r="20%" stroke={dataItem.exercise_state ? 'green' : 'red'} fill="white" />
                <text dx="45%" dy="37%" fontSize="0.8rem" style={{fill: dataItem.exercise_state ? 'green' : 'red'}}>{i+1}</text>
              </svg>
            )} 
        />
        </div>
      );
  }

  SegmentedChange(e) {
    this.setState({segmentedIndex: e.nativeEvent.selectedSegmentIndex});
  }

  PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  renderPractice(){
    var {student_id, test_log} = this.props;
    var test_config = JSON.parse(test_log.test_config);
    if(test_log.test_type == 2){
      return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            width: '100%',
            height: "3.8rem",
            zIndex: 100,
            borderTop: "solid 1px #d9d9d9",
            background: "#fff",
            }}>
          <WingBlank>
          <Button  type="primary"
            onClick={ e => this.props.getTestDataByKp(student_id, test_config.kpid, test_config.kpname)} >
              继续修炼
          </Button>
          </WingBlank>
        </div>
      )
    }
  }

  renderMyResult(){
    var {isFetching, test_log, exercise_log, test_kp} = this.props;
    var test_time = '';
    var finish_time = '';
    if(test_log.finish_time && test_log.start_time){
      console.log(test_log.finish_time, test_log.start_time);
      var time = (Date.parse(test_log.finish_time) - Date.parse(test_log.start_time)) /1000;
      // var hour = parseInt(time/3600);
      // var mini = parseInt(time%3600/60);
      // var sec = parseInt(time%60);
      // test_time = hour ? hour+ '小时' : ''  + mini ? mini : '' + '分' + sec ? sec : 00+ '秒'
      test_time = new Date(time).Format("hh:mm:ss");

      finish_time = new Date(Date.parse(test_log.finish_time)).Format('MM月dd日 hh:mm');
      console.log(exercise_log);
    }
    return(
      <div>
      <div style={{backgroundColor: '#1890ff', paddingTop: '2rem'}}>          
        <div style={{
              textAlign: 'center',
              height: '3rem',
              lineHeight: '3rem',
              color: 'white',
            }}>
              <span style={{fontSize: '3rem'}} >{test_log.correct_exercise}</span>
              <span style={{fontSize: '1rem'}}>{'/ ' + exercise_log.length + '题 耗时' + test_time}</span>
        
        </div>
        
        <div style={{
        textAlign: 'center',
        height: '3rem',
        lineHeight: '3rem',
        color: 'white',
        fontSize: '1rem'
      }}>{'交卷时间：' +  finish_time}</div>
      </div>
        {this.renderKpList()}
        <WhiteSpace/>
        {this.renderExerciseList2()}
        <ActivityIndicator animating = {isFetching}/>

        <Modal
          title='相关知识点'
          transparent
          visible={this.state.modal}
          onClose
          footer={[{ text: '确定', onPress: () => { this.setState({modal: false})} }]}
        >
          <List>
          {
            test_kp.map((item) => {
              var correct_rate = item.practice ? item.correct/item.practice : 0;
              return (
                <Item multipleLine> 
                    {item.kpname}
                    <Brief>
                      <div>
                        <span>掌握度： </span>
                        <span style={{color: '#1890ff', fontSize: '1.5rem'}}>{item.kp_rating}</span>
                      </div>
                    </Brief>
                  </Item>
              )
            })
          }
          </List>
        </Modal>
        </div>
    )
  }

  renderRanking(){
    var {ranking_list} = this.props;
    
    return (
      <List>
          <Item style={{
            color: 'black',
            fontSize: '1rem', fontWeight: 'bold',
          }}>测试排行榜</Item>
          {
            ranking_list.map((item, i) => {
              console.log("item:"+JSON.stringify(item));
              var t = (Date.parse(item.finish_time) - Date.parse(item.start_time))/1000;
              var min = this.PrefixInteger(parseInt(t/60), 2);
              var sec = this.PrefixInteger(t%60, 2);
              return (
                <Item arrow="horizontal">
                  {item.student_name}
                  <Brief>{'正确率：' + item.correct_exercise + '/6 | 耗时' + min + ':' + sec}</Brief>
                </Item>
              )
            })
          }
        </List>
    );
  }

  renderGlobalResult(){

    return(
      <div>
      <div style={{backgroundColor: '#1890ff', paddingTop: '2.5rem', paddingBottom: '0.5rem', color: 'white'}}>
        <Flex>
          <Flex.Item><div style={{
                  color: 'white',
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '2rem',
                }} >8/10</div>
                <div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '3rem',
                  width: '100%',
                  fontSize: '1rem'}}>已提交(人)</div>
          </Flex.Item>
          <Flex.Item>
                <div style={{
                  color: 'white',
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '2rem',
                }} >3.5/7</div>
                <div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '3rem',
                  width: '100%',
                  fontSize: '1rem'}}>平均答对(题)</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '2rem',
                }} >05:36</div>
                <div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '3rem',
                  width: '100%',
                  fontSize: '1rem'}}>平均耗时</div>
          </Flex.Item>
        </Flex>
      </div>
      {this.renderRanking()}
      </div>
    )
  }

  onLeftClick(){
    const {entry} = this.props;
    if(entry){
      this.props.router.push("/mobile-zq/" + entry);
    }else{
      this.props.router.push("/mobile-zq/root");
    }
  }

  navBarContent(){
    const {test_log} = this.props;
    console.log(test_log);
    if(test_log.test_type == 1){
      //老师布置
      return (<SegmentedControl values={['我的', '排行']} style={{width: '6rem'}} onChange={e => this.SegmentedChange(e)} />)
    }else if(test_log.test_type == 2){
      //自主练习
      return test_name;
    }
  }

  render() {
    const {test_log} = this.props;
    const {test_type, test_name} = test_log;

    // const accurracy = exercise_log.length ? test_log.correct_exercise/exercise_log.length : 0;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.onLeftClick()}
        >
        {this.navBarContent()}          
        </NavBar>
        {this.state.segmentedIndex ? this.renderGlobalResult() : this.renderMyResult()}
      </div>
    );
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  const {exercise_log, test_kp, test_log, isFetching, modalOpen, ranking_list, exercise, entry, exindex} = test_state;
  return {
    exindex: exindex,
    exercise: exercise,
    exercise_log: exercise_log ? exercise_log : [],
    test_kp: test_kp ? test_kp : [],
    test_log: test_log,
    entry: entry,
    ranking_list: ranking_list,
    isFetching: isFetching ? isFetching : false,
    student_id:state.AuthData.get('userid'),
  };
}, action)(TestResult);