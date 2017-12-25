import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';

import { List, Result, Icon, WhiteSpace, Progress, Badge, WingBlank, Button } from 'antd-mobile';
import { Rate } from 'antd';

const Item = List.Item;
const Brief = Item.Brief;

class KpTestResult extends React.Component {
  constructor(props) {
    super(props);
  } 

  renderKpRating(){
    const { delta_kp } = this.props;
    return (
      <List renderHeader={() => '涉及知识点'} className="my-list">
        {

          delta_kp.map((item) => {
            const t = item.kp_delta_rating >= 0 ? '+' + item.kp_delta_rating : item.kp_delta_rating;
            return (
              <Item extra={<Badge text={t} />}>{item.kpname}
                <Brief><Rate count = {3} disabled defaultValue={2} /></Brief>    
              </Item>
            )
          })
        }
      </List>
    )
  }

  getResult(){
    const {test_id, exercise_id} = this.props;
    if(test_id > 0){
      this.props.getTestResult('1', test_id);
    }
  }

  render() {
    var { delta_kp, delta_student_rating, student_rating } = this.props;

    const delta_student_rating_str = delta_student_rating > 0 ? '+' + delta_student_rating : delta_student_rating;

    return (
      <div>
      <Result
        title={
            <div>
              <div>天梯积分</div>
              <div style={{ fontSize: '0.72rem', color: '#FFFF00', lineHeight: 1 }}>
                {delta_student_rating_str}
              </div>
            </div>
          }
        message={"当前天梯分：" + student_rating}
      />
      <WhiteSpace />
      <List renderHeader={() => '学科积分'} className="my-list">
        <Item>
          <div>35 / 200</div>
          <Progress percent={50} position="normal" appearTransition />
          <Brief><div>全对 +3</div><div>击破5题 +5</div></Brief>    
        </Item>
      </List>
      <WhiteSpace />
      {this.renderKpRating()}
      <WingBlank>
        <div style={{ margin: '18px 0 18px 0'}}>
          <Button className="btn" 
          onClick={e => this.getResult()} 
          type="ghost" inline>
           OK
          </Button>
        </div>   
      </WingBlank>
    </div>);
  }
}

export default connect(state => {
  const test_state = state.testData.toJS();
  var {delta_result, test_id} = test_state;
  delta_result = {
    delta_kp: [{kpname: "二次函数标准式与定义", kp_delta_rating: +12}],
    delta_student_rating: 39,
    student_rating: 800,
    delta_points: [{}],
  }
  return {
    test_id: test_id,
    student_rating: delta_result.student_rating,
    delta_kp: delta_result.delta_kp,
    delta_student_rating: delta_result.delta_student_rating
  }; 
}, action)(KpTestResult);