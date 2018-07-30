import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';

import { List, Icon, WhiteSpace, NavBar, Progress, Badge, WingBlank, Button } from 'antd-mobile';
import { Progress as Circle } from 'antd';

const Item = List.Item;
const Brief = Item.Brief;

class KpTestResult extends React.Component {
  constructor(props) {
    super(props);
  } 

  componentDidMount(){
    const {student_id, params} = this.props;
    const test_id = params.test_id;
    if(test_id){
        // this.props.getTestRatingReward(student_id, test_id);
        this.props.getTestRatingReward(1, 124);
        // this.props.getMyLadderScore(student_id);
        // this.props.getMyScore(1);
        this.props.getMyLadderScore(1);
      // this.props.getTestRankingList(test_id);
      // this.props.getStuTestInfo(student_id,test_id);
    }else{
      alert("页面参数错误");
    }
  }

  renderKpRating(){
    const { test_reward } = this.props;
    const {kp_rating} = test_reward;
    console.log(kp_rating);
    return (
      <List className="my-list">
        <Item style={{fontWeight:"bold"}}>相关知识点能力值</Item>
        {
          kp_rating.map((item) => {
            const t = item.kp_delta_rating >= 0 ? '+' + item.kp_delta_rating : item.kp_delta_rating;
            return (
              <Item extra={
                <div>{item.kp_old_rating + "(" + t + ")"}</div>

              }>{item.kpname}   
              </Item>
            )
          })
        }
      </List>
    )
  }

  render() {
    var { test_reward, student_rating } = this.props;
    const {credit, rating, kp_rating} = test_reward;
    console.log(test_reward);
    return (
      <div>
      <div>
        <NavBar
          mode="light"
        >
        成就奖励         
        </NavBar>
      </div>
      <div style={{backgroundColor: '#fafafa', paddingTop: '3rem',paddingBottom: '3rem'}}>
        <div style={{
              textAlign: 'center',
              height: '3rem',
              lineHeight: '3rem',
              color: 'black',
            }}>
            <span style={{fontSize: '3rem'}} >{student_rating}</span>
        
        </div>
        <div style={{
              textAlign: 'center',
              height: '2rem',
              lineHeight: '2rem',
              color: 'black',
              fontSize: '1.1rem'
            }}>
            <div>
              <span>{'我的天梯 '}</span>
              <span style={{color: "#40a9ff"}}>{rating.delta_student_rating>0 ? '+'+rating.delta_student_rating : '-'+rating.delta_student_rating}</span>
            </div>
        </div>   
      </div>

      <List>
        <Item>
          <div><span style={{fontWeight: "1.2rem"}}>{"我的积分 "} </span><span style={{color: "#40a9ff",fontWeight: "1.2rem"}}>{'+15'}</span></div>
        </Item>
      </List>
      <WhiteSpace />
      {this.renderKpRating()}
      <WingBlank>
        <div style={{ margin: '18px 0 18px 0'}}>
          <Button className="btn" 
          onClick={e => this.props.router.push("/mobile-zq/test_result/" + this.props.params.test_id)} 
          type="primary">
           继续
          </Button>
        </div>   
      </WingBlank>
    </div>);
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  var {delta_result, test_id, test_reward} = test_state;
  console.log("delta_result,",delta_result);
  console.log("test_reward,",test_reward);
  const student_rating = state.studentData.get("student_rating");
  delta_result = {
    delta_kp: [{kpname: "二次函数标准式与定义", kp_delta_rating: +12}],
    delta_student_rating: 39,
    student_rating: 800,
    delta_points: [{}],
  }
  return {
    student_id: state.AuthData.get('userid'), 
    test_id: test_id,
    test_reward: test_reward,
    student_rating: student_rating,
    delta_kp: delta_result.delta_kp,
    delta_student_rating: delta_result.delta_student_rating
  }; 
}, action)(KpTestResult);