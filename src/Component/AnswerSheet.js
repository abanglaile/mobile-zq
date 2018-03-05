import React from 'react';
import ReactDOM from 'react-dom';
import { WingBlank, Icon, Grid, NavBar } from 'antd-mobile';

import *as action from '../Action/';
import {connect} from 'react-redux';


class AnswerSheet extends React.Component {
  jumpToExercise(i){
    this.props.updateExindex(i);
    this.props.updateExerciseST();
    this.props.router.push("/mobile-zq/question/");
  }

  circleFill(exercise_state){
    switch(exercise_state){
      case -1: 
        return 'white';
      case 0: 
        return '#C0C0C0';
      case 1: 
        return 'green';
    }
  }

  render() {
    const {test_log, test_status} = this.props;
    // const {exercise, exindex} = this.props.location.state;
    return (
    <div>
      <NavBar
        mode="light"
        icon={<Icon type="cross" />}
        onLeftClick={() => this.props.router.push("/mobile-zq/question")}
        >答题卡</NavBar>
      <WingBlank><div style={{fontSize: "0.5rem"}}>{test_status.test_name}</div></WingBlank>
      <Grid data={test_log} hasLine={false} onClick={(e, i) => this.jumpToExercise(i)}
            columnNum={5}
            renderItem={(dataItem,i) => (
              <svg width="75px" height="75px" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">

                <circle cx="50%" cy="50%" r="20%" stroke={dataItem.exercise_state >= 0 ? "" : "blue"} fill={this.circleFill(dataItem.exercise_state)}/>
                <text dx="45%" dy="57%" fontSize="0.3rem" style={
                  dataItem.exercise_state >= 0 ? {fill: 'white'} : {fill: 'blue'}}>
                  {i+1}</text>
              </svg>
            )} 
        />
    </div>);
  }
}

export default connect((state, ownProps) => {
  const test_data = state.testData.toJS();
  const {test_log, test_status} = test_data;
  return {
    test_status: test_status,
    test_log: test_log,
  }; 
}, action)(AnswerSheet);