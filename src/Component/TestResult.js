import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, Icon, WhiteSpace, WingBlank, ActivityIndicator, Button, Modal, NavBar, Grid, Flex, SegmentedControl, Progress } from 'antd-mobile';

//import Tex from './renderer.js';

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

function formatTime(seconds) {
    var min = Math.floor(seconds / 60),
        second = seconds % 60,
        hour, newMin, time;

    if (min > 60) {
        hour = Math.floor(min / 60);
        newMin = min % 60;
    }
    if (hour < 10 && hour) { hour = '0' + hour;}
    if (newMin < 10) { newMin = '0' + newMin;}
    if (second < 10) { second = '0' + second;}
    if (min < 10) { min = '0' + min;}

    return time = hour? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
}

function GetDateParse(time) {  
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    if(typeof(time) == 'string'){
      // console.log("time: ",time);
      // var paraTime = time.replace(/\-/g, "/");  
      // console.log("paraTime: ",paraTime);
      // console.log("Date.parse(time): ",Date.parse(time));
      return Date.parse(time);
    }else{
      return time;
    }  
    
};  

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
      this.props.getTestStatus(test_id);
      this.props.getTestRankingList(test_id);
      this.props.getMyTestStatus(student_id, test_id);
      // this.props.getTestExercise(student_id, test_id);
      this.props.getMyTestData(student_id, test_id);

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
                <span>能力值： </span>
                <span style={{color: '#1890ff', fontSize: '1.5rem'}}>{test_kp[0] ? test_kp[0].kp_rating : ''}</span>
                </div>
            </Brief>
          </Item>
          
        </List>
    )
  }

  jumpToExercise(i){
    const {params} = this.props;
    const test_id = params.test_id;
    if(test_id){
      this.props.updateExindex(i);
      this.props.router.push("/mobile-zq/question/" + test_id);
    }
  }

  renderExerciseList2(){
    const {exercise_log} = this.props;
    return (
        <div>
        <div style={{marginLeft: '1rem'}}>
        <Flex>
          <Flex.Item style={{
            color: 'black',
            fontSize: '1rem', fontWeight: 'bold'
          }}>{'答题卡(' + exercise_log.length + '题)'}</Flex.Item>
          <Flex.Item>
            <Flex>
              <Flex.Item>
                <svg width="4.5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="0%" y="50%" width="0.6rem" height="0.6rem" fill="green" />
                <text dx="18%" dy="80%" fontSize="0.8rem" >正确</text>
                </svg>
              </Flex.Item>
              <Flex.Item>
                <svg width="4.5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="0%" y="50%" width="0.6rem" height="0.6rem" fill="red" />
                <text dx="18%" dy="80%" fontSize="0.8rem" >错误</text>
                </svg>
              </Flex.Item>
              <Flex.Item>
                <svg width="4.5rem" height="2rem" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                <rect x="0%" y="50%" width="0.6rem" height="0.6rem" fill="grey" />
                <text dx="18%" dy="80%" fontSize="0.8rem" >未做</text>
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

                <circle cx="50%" cy="30%" r="20%" stroke={dataItem.exercise_state < 0 ? 'grey' : dataItem.exercise_state ? 'green' : 'red'} fill="white" />
                <text dx="45%" dy="37%" fontSize="0.8rem" style={{fill: dataItem.exercise_state < 0 ? 'grey' : dataItem.exercise_state ? 'green' : 'red'}}>{i+1}</text>
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
    console.log(test_log);
    if(test_log.test_type == 2 && test_log.test_config){
      var test_config = JSON.parse(test_log.test_config);
      console.log("test_config.kp[0]:"+JSON.stringify(test_config.kp[0]));
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
          <WhiteSpace />
          <Button  type="primary"
            onClick={ e => this.props.generateTestByKp(student_id, test_config.kp[0].kpid, test_config.kp[0].kpname)} >
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
    console.log("test_log: "+JSON.stringify(test_log));
    if(test_log.finish_time && test_log.start_time){
      console.log("test_log.finish_time before: ",test_log.finish_time);
      console.log("test_log.finish_time: ",GetDateParse(test_log.finish_time));
      var time = (GetDateParse(test_log.finish_time) - GetDateParse(test_log.start_time)) /1000;
      // var hour = parseInt(time/3600);
      // var mini = parseInt(time%3600/60);
      // var sec = parseInt(time%60);
      // test_time = hour ? hour+ '小时' : ''  + mini ? mini : '' + '分' + sec ? sec : 00+ '秒'
      console.log("time: ",time);
      test_time = formatTime(time);
      console.log("test_time: ",test_time);

      finish_time = new Date(GetDateParse(test_log.finish_time)).Format('MM月dd日 hh:mm');
    }

    if(isFetching){  
        return (<ActivityIndicator toast animating={isFetching} /> );  
    }
    
    return(
      <div>
      <div style={{backgroundColor: '#fafafa', paddingTop: '2rem'}}>          
        <div style={{
              textAlign: 'center',
              height: '3rem',
              lineHeight: '3rem',
              color: '#1890ff',
            }}>
              <span style={{fontSize: '3rem'}} >{test_log.correct_exercise}</span>
              <span style={{fontSize: '1rem',color:'#1890ff'}}>{'/ ' + exercise_log.length + '题 耗时 '}</span>
              <span style={{fontSize: '1rem',color:'#1890ff'}}>{test_time}</span>
        
        </div>
        
        <div style={{
        textAlign: 'center',
        height: '3rem',
        lineHeight: '3rem',
        color: '#1890ff',
        fontSize: '1rem'
      }}>{'交卷时间：' +  finish_time}</div>
      </div>
        {this.renderKpList()}
        <WhiteSpace/>
        {this.renderExerciseList2()}
        {this.renderPractice()}
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
                        <span>能力值： </span>
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
    console.log("ranking_list", ranking_list);
    var timeconsuming = '';
    return (
      <List>
          <Item style={{
            color: 'black',
            fontSize: '1rem', fontWeight: 'bold',
          }}>测试排行榜</Item>
          {
            ranking_list.map((item, i) => {
              console.log("item:"+JSON.stringify(item));
              timeconsuming = formatTime(item.time_consuming);
              console.log("timeconsuming:"+timeconsuming);
              return (
                <Item arrow="horizontal">
                  {item.student_name}
                  <Brief>{'正确率：' + item.correct_exercise + '/'+item.total_exercise+' | 耗时 ' + timeconsuming}</Brief>
                </Item>
              )
            })
          }
        </List>
    );
  }

  renderGlobalResult(){
    const {test_status, test_log} = this.props;
    console.log('test_status', test_status);
    var avg_time = '';
    console.log("test_status"+JSON.stringify(test_status));
    if(test_status){
      avg_time = formatTime(test_status.avg_timeconsuming);
      return(
        <div>
          <div style={{backgroundColor: 'white', paddingTop: '2.5rem', paddingBottom: '0.5rem', color: '#1890ff'}}>
            <Flex>
              <Flex.Item><div style={{
                      color: '#1890ff',
                      textAlign: 'center',
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '100%',
                      fontSize: '2rem',
                    }} >{test_status.test_submit}/
                      <span style={{fontSize:'1.5rem'}}>{test_status.test_students}</span>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      height: '3rem',
                      lineHeight: '3rem',
                      width: '100%',
                      fontSize: '1rem'}}>已提交(人)</div>
              </Flex.Item>
              <Flex.Item>
                    <div style={{
                      color: '#1890ff',
                      textAlign: 'center',
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '100%',
                      fontSize: '2rem',
                    }} >{test_status.avg_accurracy}/
                      <span style={{fontSize:'1.5rem'}}>{test_log.total_exercise}</span>
                    </div>
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
                      fontSize: '1.5rem',
                    }} >{avg_time}</div>
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
    console.log("test_log",test_log);
    if(test_log.test_type == 1){
      //老师布置
      return (<SegmentedControl values={['我的', '排行']} style={{width: '6rem'}} onChange={e => this.SegmentedChange(e)} />)
    }else if(test_log.test_type == 2){
      //自主练习
      return test_log.test_name;
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
  const {test_status, exercise_log, test_kp, test_log, isFetching, modalOpen, ranking_list, entry} = test_state;
  return {
    test_status: test_status,
    exercise_log: exercise_log,
    test_kp: test_kp,
    test_log: test_log,
    entry: entry,
    ranking_list: ranking_list,
    isFetching: isFetching ? isFetching : false,
    student_id:state.AuthData.get('userid'),
  };
}, action)(TestResult);