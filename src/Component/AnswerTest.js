import React from 'react';
import ReactDOM from 'react-dom';
import { WingBlank, Button, List, Checkbox, Flex, Modal } from 'antd-mobile';
import Tex from './renderer.js'

import *as action from '../Action/';
import {connect} from 'react-redux';
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;


class AnswerTest extends React.Component {
  constructor(props) { 
  	super(props);
    const {exercise, exindex} = this.props;
    const {breakdown} = exercise[exindex];
    var breakdown_sn = [];
    for(var i = 0; i < breakdown.length; i++){
      //如果没有前置步骤的都设为0并在渲染中显示，-1代表不确定在渲染中不显示
      const sn_state = breakdown[i].presn ? -1 : 0;
      breakdown_sn[i] = {
        sn: breakdown[i].sn, 
        kpid: breakdown[i].kpid,
        kpname: breakdown[i].kpname, 
        sn_state: sn_state, 
        presn: breakdown[i].presn, 
        kp_old_rating: breakdown[i].kp_rating, 
        sn_old_rating: breakdown[i].sn_rating
      };
    }
    console.log(breakdown_sn);
    var show_all = {dis: 'none', a_title: "显示题目"};

    this.state = { breakdown_sn: breakdown_sn , show_all: show_all};
  	this.onChange = this.onChange.bind(this);
  }

  onChange(val){
  	var {breakdown_sn} = this.state;
  	breakdown_sn[val].sn_state = breakdown_sn[val].sn_state ? 0 : 1;
    //取消选择，将以这步作为前置的步骤全部设为不确定-1并不渲染显示
    for(var i = 0; i < breakdown_sn.length; i++){
      if(breakdown_sn[i].presn == breakdown_sn[val].sn){
        //如果选择则把二级知识点设置为0，如果取消选择则把二级知识点设置为-1
        breakdown_sn[i].sn_state = breakdown_sn[val].sn_state ? 0 : -1;
      }
    }
  	this.setState({breakdown_sn});
    console.log(breakdown_sn);
  }

  onNext(e){
    var {exindex, exsize} = this.props;
    this.props.submitFeedBack(exindex, this.state.breakdown_sn);
  }

  onShow(e){
    var {show_all} = this.state;
    show_all = show_all.dis=='none'?{dis: "block", a_title: "收起题目"}:{dis: "none", a_title: "显示题目"};
    this.setState({show_all});
  }

  renderBreakdown(){
    const {exercise, exindex} = this.props;
    const {breakdown, title} = exercise[exindex];
    const {breakdown_sn} = this.state;
    return (
      breakdown.map((item,i) => {
          console.log(breakdown_sn[i].sn_state);
          const presn = item.presn;
          //显示第一个或前置已经被选择（最后答案不显示）
          if((i != breakdown.length - 1) && (breakdown_sn[i].sn_state >= 0 || (presn > 0 && breakdown_sn[presn - 1].sn_state > 0))){
            return (
            <CheckboxItem key={item.sn} check={breakdown_sn[i].sn_state}onChange={() => this.onChange(i)} wrap>
              <Tex content = {item.content} />
            </CheckboxItem>
            )
          }
        })
    );
    
  }

  render() {
    const {exercise, exindex, modalOpen} = this.props;
    const {breakdown, title} = exercise[exindex];
    var { show_all } = this.state;
    // const {exercise, exindex} = this.props.location.state;
    return (
    <div>
      <WingBlank>
        <div style={{ margin: '0.5rem 0 0 0'}}>
          <div style={{ display: show_all.dis }}>
            <Tex content={title} />
          </div>
          <a onClick={e => this.onShow(e)}><u>{show_all.a_title}</u></a>
        </div>
      </WingBlank>
      <List renderHeader='请选择你做对的步骤'>
        {this.renderBreakdown()}
      </List>
      <WingBlank>
        <div style={{ margin: '1rem 0 0 0'}} className="btn-container">
          <div>
            <Button className="btn" type="ghost" onClick={e => this.onNext(e)}>Submit</Button>
          </div>
        </div>
      </WingBlank>
      <Modal
          title='小秋已经收到你的反馈！'
          transparent
          maskClosable={false}
          visible={modalOpen}
          footer={[{ 
            text: '', 
            onPress: () => this.props.jumpNext(false, false, exindex, exercise.length, breakdown.length)}]}
        >
      </Modal>
    </div>);
  }
}

export default connect((state, ownProps) => {
  const test_state = state.testData.toJS();
  const {exercise, exindex, record, test_log, modalOpen} = test_state;
  return {
    exercise: exercise,
    exindex: exindex,
    test_log: test_log,
    record: record,
    modalOpen: modalOpen,
  }; 
}, action)(AnswerTest);