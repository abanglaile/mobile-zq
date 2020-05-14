import React from 'react';
import ReactDOM from 'react-dom';
import { InputItem, WingBlank, Grid, Flex, List, Checkbox, Button, Icon, Modal, Toast, Progress, Badge, NavBar,ActivityIndicator} from 'antd-mobile';
import Tex from './renderer.js';
// import MathInput from '../../math-input/src/components/app.js'

import *as action from '../Action/';
import {connect} from 'react-redux';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

import { createForm } from 'rc-form';

const Item = List.Item;
const alert = Modal.alert; 
class QuestionXcx extends React.Component {
  constructor(props) { 
  	super(props);
    this.answer_img = [];
    this.state = {
      sheetmodal: false,
      title_img_width: "auto",
      // title_img_height: "3rem",
      title_img_height: "auto",
      // title_img_width: "18rem",
      // title_img_height: "auto",
      answer_img_width: "auto",
      answer_img_height: "3rem",
    };
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    console.log("student_id:",student_id);
    const test_id = params.test_id;
    //TO-DO
    this.props.getMyTestData(student_id, test_id);
  }

  componentWillUnmount(){
    const {exindex} = this.props;
    if(exindex){
      this.props.updateExindex(0);
    }  
  }

  componentWillReceiveProps(nextProps){
    if(this.props.exindex !== nextProps.exindex){
      this.setState({
        sheetmodal: false,
        title_img_width: "auto",
        // title_img_height: "3rem",
        title_img_height: "auto",
        answer_img_width: "auto",
        answer_img_height: "3rem",
      });
    }
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
  	var {exercise_log, exindex} = this.props;
  	var {breakdown_sn} = exercise_log[exindex];
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
    this.props.closeModal();
    this.accExerciseTime();
    this.props.jumpNext();
  }

  onInputChange(val){
    this.userAnswer = val;
  }

  accExerciseTime(){
    const {exercise_st, exindex, exercise_log} = this.props;
    const {exercise_status} = exercise_log[exindex];
    //做题页面累加页面停留时间
    if(exercise_status == 0){
      const ac_time = Date.parse(new Date()) - Date.parse(exercise_st);
      this.props.updateExerciseTime(exindex, ac_time/1000);
    }
  }

  jumpToExercise(i){
    this.setState({
      sheetmodal: ! this.state.sheetmodal,
    });
    this.accExerciseTime();
    this.props.updateExindex(i);
    // this.props.updateExerciseST();
    // this.props.router.push("/mobile-zq/question/");
  }

  titleImageLoaded(){
    console.log("titleImageLoaded:",this.title_img.width, window.innerWidth);
    console.log("this.title_img.width > window.innerWidth",this.title_img.width > window.innerWidth);
    if(this.title_img.width > window.innerWidth*0.9){
      this.setState({title_img_width: "90%", title_img_height: "auto"})
    }
  }

  answerImageLoaded(i){
    console.log(this.answer_img[i].width, window.innerWidth);
    if(this.answer_img[i].width > window.innerWidth){
      this.setState({answer_img_width: "90%", answer_img_height: "auto"})
    }
  }

  renderTitle(){
    const {exercise, exindex} = this.props;
    const {title, title_img_url, title_audio_url} = exercise[exindex]; 
    const {title_img_width, title_img_height} = this.state;
    console.log("exercise.sample :"+JSON.stringify(exercise[0].sample));
    console.log("title_img_width, title_img_height:",title_img_width,title_img_height);
    return (
      <div style={{ margin: '30px 0 18px 0', fontSize: '1.0rem'}}>
        <Tex content={title} />
        {
          title_img_url? 
          <div>
          <img src={title_img_url}  ref={element => {
              this.title_img = element;
              console.log("this.title_img:",element);
            }} onLoad = {() => this.titleImageLoaded()}  style={{display:'none'}}/>
           {/* }} onLoad = {() => this.titleImageLoaded()} style={{width: title_img_width, height: title_img_height}} /> */}
          <img src={title_img_url} style={{width: title_img_width, height: title_img_height}} />
          </div>
          :
          null
        }
        {
          title_audio_url?
          <div> 
            <audio src={title_audio_url} controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>
          :
          null
        }
      </div>
    )
  }

  renderAnswer(){
    const {exercise, exindex, exercise_log} = this.props;
    const {exercise_type, answer} = exercise[exindex];
    console.log("renderAnswer exercise_type :", exercise_type);
    // console.log(exercise_log, exindex);
    const {exercise_state, exercise_status} = exercise_log[exindex];
    const answer_log = exercise_log[exindex].answer;
    console.log(answer_log);
    const answerjson = answer;
    
    const wrongColor = "#ff7875", correctColor = "#73d13d";

    const { getFieldProps } = this.props.form;

    switch(exercise_type){
      case 0:
        //TO-DO: 添加多个填空答案
        // return (
        //   <MathInput onChange={(v) => this.onInputChange(v)} />

        // );
        if(exercise_status >= 1){
          return(
            <List>              
              {answer_log.map((item, index) => {
                if(item.value == item.fill){
                  return (
                    <List.Item thumb={<Icon size="lg" type="check" color={correctColor} />}>
                      <div style={{color: correctColor, fontWeight: "bold"}}>{item.fill}</div>
                    </List.Item>
                  )
                }else{
                  return ( 
                  <List.Item thumb={<Icon size="lg" type="cross" color={wrongColor} />} 
                    extra = {<div>正确答案：{item.value}</div>}>
                    <div style={{color: wrongColor, fontWeight: "bold"}}>{item.fill}</div>
                  </List.Item>
                  )
                }
              })}
            </List>
          )
        }else{
          console.log(answer_log)
          return(
            <List>              
              {answer_log.map((item, index) => 
                <InputItem
                    {...getFieldProps('money2', {
                      normalize: (v, prev) => {
                        if (v && !/^[a-z]+$/.test(v)) {
                          return prev;
                        }
                        return v.toUpperCase();
                      },
                    })}
                    onChange={(v) => this.props.inputChange(exindex, index, v.toUpperCase())}
                    type={"text"}
                    value={item.fill}
                    maxLength={7}
                    placeholder="填入英文选项"
                    clear
                  >
                  （{index}）  
                </InputItem>
              )}
            </List>
          )
        }
      case 1:
        //文字选择题
        //已做完
        if(exercise_status >= 1){
          console.log(answer_log);
          return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => {
                let borderStyle = {border:"1px solid #f5f5f5",borderRadius: "5px",margin :"1rem 0"};
                let iconflag = null;
                if(answer_log[index].correct){
                  borderStyle = {border:"2px solid " + correctColor, borderRadius: "5px",margin :"1rem 0"};
                  iconflag = <Icon type="check" color={correctColor} />;
                }else if(answer_log[index].select){
                  borderStyle =  {border:"2px solid " + wrongColor, borderRadius: "5px",margin :"1rem 0"};
                  iconflag = <Icon type="cross" color={wrongColor} />;
                }
                return(
                  <CheckboxItem extra={iconflag} key={index} disabled defaultChecked = {answer_log[index].select} 
                    style={borderStyle}
                    onChange={() => this.props.selectChange(exindex, index)} wrap>
                    <Tex content = {i.value} />
                  </CheckboxItem>
                )
              })}
            </List>
          );
        }
        //未做完
        else {
          return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => (
                <CheckboxItem key={index} defaultChecked = {answer_log[index].select} 
                  style={{border:"1px solid #f5f5f5",borderRadius: "5px",margin :"1rem 0"}}
                  onChange={() => this.props.selectChange(exindex, index)} wrap>
                  <Tex content = {i.value} />
                </CheckboxItem>
              ))}
            </List>
          );
        }
      case 2:
        const {answer_img_width, answer_img_height} = this.state;
        console.log("answer_img_width answer_img_height",answer_img_width,answer_img_height);
        console.log("answerjson",JSON.stringify(answerjson));
        console.log("exercise_status",exercise_status);
        //已做完
        if(exercise_status >= 1){
          return (
            <List key={'answer'+ exindex}>
              {answerjson.map((i,index) => {

                let borderStyle = {border:"1px solid #f5f5f5",borderRadius: "5px",margin :"1rem 0"};
                let iconflag = null;
                if(answer_log[index].correct){
                  borderStyle = {border:"2px solid " + correctColor, borderRadius: "5px",margin :"1rem 0"};
                  iconflag = <Icon type="check" color={correctColor} />;
                }else if(answer_log[index].select){
                  borderStyle =  {border:"2px solid " + wrongColor, borderRadius: "5px",margin :"1rem 0"};
                  iconflag = <Icon type="cross" color={wrongColor} />;
                }

                return (
                  <CheckboxItem extra={iconflag} key={index} disabled defaultChecked = {answer_log[index].select}
                    style={borderStyle} 
                    onChange={() => this.props.selectChange(exindex, index)} wrap>
                    <img src={i.value} ref={element => {this.answer_img[index] = element;}} 
                    onLoad = {() => this.answerImageLoaded(index)} 
                    style={{height: answer_img_height, width: answer_img_width}}/>
                  </CheckboxItem>
                )
              })}
            </List>
          );  
        }else{
          //未做完
          return (
              <List key={'answer'+ exindex}>
                {answerjson.map((i,index) => (
                  <CheckboxItem key={index} defaultChecked = {answer_log[index].select}
                    style={{border:"1px solid #f5f5f5",borderRadius: "5px",margin :"1rem 0"}} 
                    onChange={() => this.props.selectChange(exindex, index)} wrap>
                    <img src={i.value} style={{height: "4rem", width: "auto"}}/>
                  </CheckboxItem>
                ))}
              </List>
          );
        }  
      default:
        return;
    }
  }

  renderModal(){ 
    const {modalOpen, exindex, exercise_log} = this.props;
    var {delta_student_rating, exercise_state} = exercise_log[exindex];
    let title = '', content = "答案已成功提交"
    console.log(exercise_log[exindex]);
    delta_student_rating = delta_student_rating ? delta_student_rating : 0;
    // var delta_tip = delta_student_rating < 0 ? delta_student_rating : '+' + delta_student_rating;  
    console.log(exercise_state)
    switch(exercise_state){
      case 0: 
        title = 'Sorry!'
        content = '天梯分 ' + delta_student_rating
        break;
      case 1:
        title = 'Bingo!'
        content = '天梯分 +' + delta_student_rating
    }
    return (
      <Modal
          transparent
          title={<span style={{fontSize: "2rem", color: "#1890ff"}}>{title}</span>}
          maskClosable={false}
          visible={modalOpen}
          footer={[{ 
            text: 'OK', 
            onPress: () => this.onContinue()}]}
        > 
        <span style={{fontSize: "1.1rem", fontWeight: "BOLD"}}>{content}</span><br />
      </Modal>
    ) 
  }

  renderAnswerTest(){
    const {exercise, exindex, exercise_log, modalOpen} = this.props;
    const {breakdown, title} = exercise[exindex];
    const {exercise_state, exercise_type, exercise_status, answer_test, breakdown_sn} = exercise_log[exindex];
    console.log("exercise_log", exercise_log[exindex].old_exercise_rating);
    const selfCheck = true
    if(exercise_status == 1){
      //主观答案未批改 && 允许自批改
      /***TO-DO: 提交未完成 */
      if(exercise_state < 0){
        return (
          <List renderHeader='自助批改'>
            {
              selfCheck ? 
              <Item style = {{ display: selfCheck ? 'block' : 'none'}}>
                <Button type="primary" size="small" inline onClick={e => this.props.selfCheck(exercise_log[exindex], exercise_type, 1, exindex)}>答案正确</Button>
                <Button size="small" inline style={{ marginLeft: '2.5px' }} onClick={e => this.props.selfCheck(exercise_log[exindex], exercise_type, 0, exindex)}>答案错误</Button>
              </Item>
              : null
            }
            {
              breakdown.map((item,i) => 
                <CheckboxItem disabled key={item.sn} wrap>
                  <Tex content = {item.content} />
                </CheckboxItem>
              )
            }
          </List>
        )
      }else {
        return (
          <List renderHeader='请选择你做对的步骤'>
            {breakdown.map((item,i) => {
              console.log(breakdown_sn[i]);
              const presn = item.presn;
              //自助判断阶段显示完整答案 || 显示第一个或前置已经被选择（最后答案不显示）
              if((i != breakdown.length - 1) && (breakdown_sn[i].sn_state >= 0 || (presn > 0 && breakdown_sn[presn - 1].sn_state > 0))){
                return (
                <CheckboxItem disabled={exercise_status == 0.5} key={item.sn} check={breakdown_sn[i].sn_state} onChange={() => this.props.breakdownSelectChange(exindex, i)} wrap>
                  <Tex content = {item.content} />
                </CheckboxItem>
                )
              }
            })}
          </List>
        );
      }
    }
  }

  renderBreakdown(){
    const {exercise, exindex, exercise_log} = this.props;
    const {breakdown, title} = exercise[exindex];
    const {exercise_state, exercise_status, answer_test, breakdown_sn} = exercise_log[exindex];
    if(exercise_status == 2){
      return (
        <List renderHea der={() => '答案解析'} >
          {
            breakdown_sn.map((item, i) => {
                console.log(i, breakdown_sn[i]);
                return (
                  <Item arrow="horizontal" multipleLine wrap onClick={() => this.props.router.push("/mobile-zq/studentkp/" + item.kpid)}
                    style={item.sn_state == 0 ? {backgroundColor: "#ffccc7"} : {backgroundColor: "white"}}>
                    <Tex content = {breakdown[i].content} />
                    <Item.Brief>{item.kpname}</Item.Brief>
                  </Item>
                )
            })
          }
        </List>
      )
    }
  }

  renderSubmitFooter(){
    const {exindex, exercise_log, exercise, student_rating} = this.props;
    const { exercise_state, exercise_status} = exercise_log[exindex];
    if(exercise_status == 1){
      return(
      <div style={{
        position: 'fixed',
                    bottom: '3rem',
                    width: '100%',
                    height: "3.1rem",
                    borderTop: "solid 1px #CCC",
                    zIndex: 100,
                    background: "#fff",
              }}>
        <WingBlank>
        <Flex>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                  onClick={e => this.props.submitBreakdownLog(exercise_log[exindex], exindex)} 
                  type="ghost" size='small'>
              没有思路
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                  onClick={e => this.props.submitBreakdownLog(exercise_log[exindex], exindex)} 
                  type="primary" size='small'>
              提交反馈
            </Button>
          </Flex.Item>
        </Flex>
        </WingBlank>
      </div>
      )
    }else if(exercise_status == 0){
      return(
      <div style={{
        position: 'fixed',
                    bottom: '3rem',
                    width: '100%',
                    height: "3.1rem",
                    borderTop: "solid 1px #CCC",
                    zIndex: 100,
                    background:"#fff",
              }}>
        <WingBlank>
        <Flex>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                onClick={e => this.props.submitExerciseLog(exercise_log[exindex], exercise[exindex].exercise_type, exindex)} 
                type="ghost" size='small'>
              我不会做
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button style={{margin: '0.5rem 0 0 0'}}
                onClick={e => this.props.submitExerciseLog(exercise_log[exindex], exercise[exindex].exercise_type, exindex)} 
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
    const {exindex, exercise, exercise_log} = this.props;
    const {sheetmodal} = this.state;
      return (
          <div style={{
                  position: 'fixed',
                  bottom: '0',
                  width: '100%',
                  height: "3rem",
                  zIndex: 100,
                  background: "#fff",
                  borderTop: "solid 1px #CCC",
                  }}>
                <WingBlank>
                <div height="3rem" style={{marginTop: '0.5rem'}}>
                <Button inline 
                  style={{margin: '0 18% 0 0rem'}} 
                  type="ghost"                
                  size="small"
                  onClick={(e) => this.showModal(e)}
                >
                  题目列表
                </Button>
                <Button inline 
                  style={{margin: '0 5% 0 0'}} 
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
                  <Grid data={exercise_log} hasLine={false} onClick={(e, i) => this.jumpToExercise(i)}
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

  onLeftClick(){
    const {test_log, entry} = this.props;
    const {finish_time} = test_log;
    this.props.router.goBack();
    // if(finish_time){
    //   //测试已结束
    //   this.props.router.goBack();  
    // }else{
    //   alert('退出练习？', '退出后将不保存本次练习记录', 
    //       [
    //         { text: '取消', onPress: () => console.log('cancel') },
    //         { text: '退出练习', onPress: () => this.props.router.goBack()},
    //       ])
    // }
  }

  render() {
    const {exercise, exindex, exercise_log, record, feedbackToast, isFetching} = this.props;
    // console.log("exercise:::::: ",JSON.stringify(exercise));
    console.log("exercise_log: ", exercise_log, exindex);
    const { exercise_status } = exercise_log[exindex];
    
    if(feedbackToast){
      Toast.success("谢谢你的反馈", 1, () => {
        this.props.hideFeedbackToast();
        this.accExerciseTime();
        this.props.jumpNext();
      })
    }
   
    return (
      isFetching ?
        <ActivityIndicator toast animating={isFetching} />
      :
      <div>
        <NavBar
        mode="light"
        icon={<Icon type="cross" />}
        onLeftClick={() => this.onLeftClick()}
        rightContent={[
          <div><span style={{fontSize: '2rem'}}>{exindex + 1}</span><span>{'/' + exercise.length}</span></div>
        ]}
        ></NavBar>
        <WingBlank>
        {this.renderAnswerTest()}
        {this.renderTitle()}
        </WingBlank>
        <WingBlank>
        {this.renderAnswer()}
        {this.renderBreakdown()}
        </WingBlank>
        <div style={{
                  width: '100%',
                  height: "6rem",}}>
        </div>
        {this.renderSubmitFooter()}
        {this.renderFooter()}
        {this.renderModal()}
      </div>
    );
  }
}



export default connect(state => {
  var test_state = state.testData.toJS();
  var student_rating = state.studentData.get("student_rating");
  // console.log(test_state);
  var {exercise, exindex, exercise_log, test_log, modalOpen, feedbackToast, exercise_st, isFetching} = test_state;
  console.log("test_log: ",test_log);
  console.log("test_log.test_id: ",test_log.test_id);
  return {
    test_log: test_log,
    //跳转题目页面开始时间
    exercise_st: exercise_st,
    exercise: exercise,
    exindex: exindex, 
    exercise_log: exercise_log,
    modalOpen: modalOpen, 
    student_rating: student_rating,
    feedbackToast: feedbackToast,
    isFetching : isFetching,
    student_id:state.AuthData.get('userid'),
  }; 
}, action)(createForm()(QuestionXcx));