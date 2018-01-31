import React from 'react';
import ReactDOM from 'react-dom';
import { WingBlank, Grid, Flex, List, Checkbox, Button, Icon, Modal, Toast, Progress, NavBar,ActivityIndicator} from 'antd-mobile';
import Tex from './renderer.js';
// import MathInput from '../../math-input/src/components/app.js'

import *as action from '../Action/';
import {connect} from 'react-redux';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

const Item = List.Item;
const alert = Modal.alert; 
class Question extends React.Component {
  constructor(props) { 
  	super(props);
    this.state = {
      sheetmodal: false,
    };
  	this.onSelectChange = this.onSelectChange.bind(this);
  }

  showModal(e){
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      sheetmodal: ! this.state.sheetmodal,
    });
  }

  onCloseModal(){
    this.setState({
      sheetmodal: ! this.state.sheetmodal,
    });
  }


  circleFill(exercise_state){
    switch(exercise_state){
      case -1: 
        return 'white';
      case 0: 
        return '#ff7875';
      case 1: 
        return '#73d13d';
    }
  }

  strokecol(exercise_state){
    switch(exercise_state){
      case -1: 
        return '#595959';
      case 0: 
        return '#ff7875';
      case 1: 
        return '#73d13d';
    }
  }

  isAllUnSelected(){
  	var {test_log, exindex} = this.props;
  	var {breakdown_sn} = test_log[exindex];
  	for(var i = 0; i < select.length; i++){
  		console.log(select[i].sn + ":" + select[i].isSelected);
  		if(select[i].isSelected){
  			result = false;
  			break;
  		}
  	}
  	return result;
  }

  onContinue(){
    this.accExerciseTime();
    this.props.jumpNext(false);
  }

  onInputChange(val){
    this.userAnswer = val;
  }

  onSelectChange(val){
    const xornum = [1, 2, 4, 8];
  	//通过异或修改选项结果
    this.userAnswer = this.userAnswer ^ xornum[val];
  }

  // onMaskClose(e){
  //   Popup.hide();
  // }

  accExerciseTime(){
    //累加页面停留时间
    const {exercise_st, exindex} = this.props;
    const ac_time = Date.parse(new Date()) - Date.parse(exercise_st);
    this.props.updateExerciseTime(exindex, ac_time/1000);
  }

  jumpToExercise(i){
    this.setState({
      sheetmodal: ! this.state.sheetmodal,
    });
    this.props.updateExindex(i);
    this.props.updateExerciseST();
    this.props.router.push("/mobile-zq/Question/");
  }

  // jumpToExercise(e, i){
  //   this.accExerciseTime();
  //   this.props.updateExindex(i);
  //   Popup.hide();
  // }

  // onPopup(e){
  //   const {exercise, test_log} = this.props;
  //   e.preventDefault();
  //   Popup.show(
  //   <div>
  //     <List renderHeader={this.renderHeader}
  //         style={{height: "4.2rem", overflow: "auto"}}
  //     >
  //       {exercise.map((item, i) => (
  //         test_log[i].delta_student_rating
  //         ? <List.Item onClick={e => this.jumpToExercise(e, i)} extra={<Icon type={test_log[i].exercise_state ? 'check' : 'cross'} />} key={i}>{i+1}</List.Item>
  //         : <List.Item arrow="horizontal" onClick={e => this.jumpToExercise(e, i)} key={i} >{i+1}</List.Item>
  //       ))}
  //     </List>
  //   </div>, 
  //     { animationType: 'slide-up', onMaskClose: e => this.onMaskClose()});
  // }

  renderTitle(){
    const {exercise, exindex} = this.props;
    const {title, title_img_url, title_audio_url} = exercise[exindex]; 
    return (
      <div style={{ margin: '30px 0 18px 0', fontSize: '1.0rem'}}>
        <Tex content={title} />
        {
          title_img_url? 
          <img src={title_img_url} height="3rem" />
          :
          null
        }
        {
          title_audio_url? 
          <audio src={title_audio_url} controls="controls">
            Your browser does not support the audio element.
          </audio>
          :
          null
        }
      </div>
    )
  }

  renderAnswer(){
    const {exercise, exindex, test_log} = this.props;
    const {exercise_type} = exercise[exindex];
    console.log(test_log);
    const {answer, exercise_state} = test_log[exindex];
    const answerjson = answer;
    console.log(answer);
    
    switch(exercise_type){
      case 0:
        //TO-DO: 添加多个填空答案
        // return (
        //   <MathInput onChange={(v) => this.onInputChange(v)} />

        // );
      case 1:
        //文字选择题
        //已做完
        if(exercise_state >= 0){
          return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => (
                <CheckboxItem key={index} disabled defaultChecked = {i.select} 
                  onChange={() => this.props.selectChange(exindex, index)} wrap>
                  <Tex content = {i.value} />
                </CheckboxItem>
              ))}
            </List>
          );
        }
        //未做完
        return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => (
                <CheckboxItem key={index} defaultChecked = {i.select} 
                  onChange={() => this.props.selectChange(exindex, index)} wrap>
                  <Tex content = {i.value} />
                </CheckboxItem>
              ))}
            </List>
          );
      case 2:
        if(exercise_state >= 0){
          return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => (
                <CheckboxItem key={index} disabled defaultChecked = {i.select} 
                  onChange={() => this.props.selectChange(exindex, index)} wrap>
                  <img src={i.url} style={{height: "4rem", width: "auto"}}/>
                </CheckboxItem>
              ))}
            </List>
          );  
        }
        return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => (
                <CheckboxItem key={index} defaultChecked = {i.select} 
                  onChange={() => this.props.selectChange(exindex, index)} wrap>
                  <img src={i.url} style={{height: "4rem", width: "auto"}}/>
                </CheckboxItem>
              ))}
            </List>
          );  
      default:
        return;
    }
  }

  renderModal(){
    const defaultLog = {
      delta_student_rating: 0,
      exercise_state: 0,
    };
    const {modalOpen, record, exindex, exercise, test_log} = this.props;
    const {breakdown} = exercise[exindex];
    const {delta_student_rating, exercise_state} = (test_log && test_log[exindex]) ? test_log[exindex] : defaultLog;
    var title = '很遗憾，错了！';
    var delta_tip = delta_student_rating < 0 ? delta_student_rating : '+' + delta_student_rating;  
    if(exercise_state){
        title = 'Bingo!';
    }
    return (
      <Modal
          transparent
          title={title}
          maskClosable={false}
          visible={modalOpen}
          footer={[{ 
            text: 'OK', 
            onPress: () => this.onContinue()}]}
        > 
        天梯分: {delta_tip}<br />
      </Modal>
      ) 
  }

  renderBreakdown(){
    const {exercise, exindex, test_log, modalOpen} = this.props;
    const {breakdown, title} = exercise[exindex];
    const {exercise_state, answer_test, breakdown_sn} = test_log[exindex];
    if(answer_test){
      
      return (
      <List renderHeader='请选择你做对的步骤'>
        {breakdown.map((item,i) => {
          console.log(breakdown_sn[i].sn_state);
          const presn = item.presn;
          //显示第一个或前置已经被选择（最后答案不显示）
          if((i != breakdown.length - 1) && (breakdown_sn[i].sn_state >= 0 || (presn > 0 && breakdown_sn[presn - 1].sn_state > 0))){
            return (
            <CheckboxItem key={item.sn} check={breakdown_sn[i].sn_state} onChange={() => this.props.breakdownSelectChange(exindex, i)} wrap>
              <Tex content = {item.content} />
            </CheckboxItem>
            )
          }
        })}
      </List>
      );
    }else if(!modalOpen && test_log[exindex].exercise_state >= 0){
      var kpids = [];
      return (
        <List renderHeader={() => '相关知识点情况'} >
          {
            breakdown_sn.map((item) => {
              if(!kpids[item.kpid]){
                kpids[item.kpid] = 1;
                return (
                  <Item style={item.sn_state == 0 ? {backgroundColor: "#fcdbc9"} : {backgroundColor: "white"}}
                    extra={item.kp_old_rating}>
                    {item.kpname}
                    
                  </Item>
                )
              }
            })
          }
        </List>
      )
    }
    
  }

  renderSubmitFooter(){
    const {exindex, test_log, exercise, student_rating} = this.props;
    const { exercise_state} = test_log[exindex];
    if(test_log[exindex].answer_test){
      return(
      <div style={{
        position: 'fixed',
                    bottom: '3.8rem',
                    width: '100%',
                    height: "2.2rem",
                    borderTop: "solid 1px #CCC",
              }}>
        <WingBlank>
        <Flex>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                  onClick={e => this.props.submitFeedBack(exindex)} 
                  type="ghost" size='small'>
              没有思路
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                  onClick={e => this.props.submitFeedBack(exindex)} 
                  type="primary" size='small'>
              提交反馈
            </Button>
          </Flex.Item>
        </Flex>
        </WingBlank>
      </div>
      )
    }else if(exercise_state < 0){
      return(
      <div style={{
        position: 'fixed',
                    bottom: '3.8rem',
                    width: '100%',
                    height: "2.2rem",
                    borderTop: "solid 1px #CCC",
              }}>
        <WingBlank>
        <Flex>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                onClick={e => this.props.submitExerciseLog(exercise[exindex], test_log[exindex].answer,student_rating)} 
                type="ghost" size='small'>
              我不会做
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                onClick={e => this.props.submitExerciseLog(exercise[exindex], test_log[exindex].answer,student_rating)} 
                type="primary" size='small'>
              提交答案
            </Button>
          </Flex.Item>
        </Flex>
        </WingBlank>
      </div>
      )
    }
  }

  renderFooter(){
    const {exindex, exercise, test_log, test_status} = this.props;
    console.log("test_log:"+JSON.stringify(test_log));
    const {sheetmodal} = this.state;
      return (
          <div style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  height: "3rem",
                  borderTop: "solid 1px #CCC",
                  }}>
                <WingBlank>
                <div height="3rem" style={{marginTop: '0.5rem'}}>
                <Button inline 
                  style={{margin: '0 25% 0 0rem'}} 
                  type="ghost"                
                  size="small"
                  onClick={(e) => this.showModal(e)}
                >
                  题目列表
                </Button>
                <Button inline 
                  style={{margin: '0 1rem 0 0'}} 
                  type="ghost"
                  size="small"
                  disabled = {exindex == 0}
                  onClick={e => this.props.updateExindex(exindex-1)}
                >
                  上一题
                </Button>
                <Button inline 
                  style={{margin: '0rem 0 0 0'}} 
                  type="ghost"                
                  size="small"
                  disabled = {exindex == exercise.length - 1}
                  onClick={e => this.props.updateExindex(exindex+1)}
                >
                  下一题
                </Button>
                </div>
                </WingBlank>

                <Modal
                  popup
                  visible={sheetmodal}
                  onClose={() => this.onCloseModal()}
                  animationType="slide-up"
                >
                  <Grid data={test_log} hasLine={false} onClick={(e, i) => this.jumpToExercise(i)}
                      columnNum={5}
                      renderItem={(dataItem,i) => (
                        <svg width="75px" height="75px" version="1.1"
                              xmlns="http://www.w3.org/2000/svg">

                          <circle cx="50%" cy="30%" r="20%" stroke={this.strokecol(dataItem.exercise_state)} fill={this.circleFill(dataItem.exercise_state)}/>
                          <text dx="45%" dy="37%" fontSize="0.8rem" style={
                            {fill: dataItem.exercise_state > -1 ? 'white' : '#595959'}}>
                            {i+1}</text>
                        </svg>

                      )} 
                  />
                </Modal>
          </div>
      )
  }


  render() {
    const {exercise, exindex, test_log, record, feedbackToast, answer_test, isFetching} = this.props;
    console.log(exindex);
    const { title, options } = exercise[exindex];
    
    if(feedbackToast){
      Toast.success("谢谢你的反馈", 1, () => {
        this.props.hideFeedbackToast();
        this.accExerciseTime();
        this.props.jumpNext(true);
      })
    }
    /*
    // <div style={{ margin: '0 0.30rem', width: '1.6rem!important', margin: '0.18rem 0.18rem 0.18rem 0'}}>
    //     <Flex>
    //       <Flex.Item><Icon type="cross" size="lg" color="red" /></Flex.Item>
    //       <Flex.Item><div style={{textAlign: 'center', width: '100%', color: '#bbb', fontSize: '0.3rem'}}>02:33</div></Flex.Item>
    //       <Flex.Item>
    //         <div>
    //           <Icon type="check" size="xs" color="blue" />{record.correct}
    //           <Icon type="cross" size="xs" color="red" />{record.wrong}
    //         </div>
    //       </Flex.Item>
    //     </Flex>
        
    //   </div>
    */
   
    return (
      isFetching ?
      <div>
        <ActivityIndicator animating={isFetching} />
      </div>
      :
      <div>
        <NavBar
        mode="light"
        icon={<Icon type="cross" />}
        onLeftClick={exindex > 0 ?
          () => alert('退出练习？', '退出后将不保存本次练习记录', 
          [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '退出练习', onPress: () => this.props.router.push("/mobile-zq/mytest")},
          ])
          :
          () => this.props.router.push("/mobile-zq/mytest")
        }
        rightContent={[
          <div><span style={{fontSize: '2rem'}}>{exindex + 1}</span><span>{'/' + exercise.length}</span></div>
        ]}
        ></NavBar>
        <WingBlank>
        {this.renderBreakdown()}
        {this.renderTitle()}
        </WingBlank>
        {this.renderAnswer()}
        {this.renderSubmitFooter()}
        {this.renderFooter()}
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  console.log(test_state);
  const {exercise, exindex, test_log, test_status, modalOpen, feedbackToast, record, exercise_st, start_time, answer_test , isFetching, student_rating} = test_state;
  return {
    test_status: test_status,
    //整个测试以同一个开始时间
    start_time: start_time,
    //跳转题目页面开始时间
    exercise_st: exercise_st,
    exercise: exercise,
    exindex: exindex,
    test_log: test_log,
    modalOpen: modalOpen,
    student_rating : student_rating,
    record: record,
    feedbackToast: feedbackToast,
    answer_test: answer_test,
    isFetching : isFetching,
  }; 
}, action)(Question);