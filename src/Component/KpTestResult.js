import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';

import { List, Result, Icon, WhiteSpace, Progress, Badge, WingBlank, Button } from 'antd-mobile';
import { Rate, Progress as Circle } from 'antd';

const Item = List.Item;
const Brief = Item.Brief;

class KpTestResult extends React.Component {
  constructor(props) {
    super(props);
  } 

  componentDidMount(){
    const {student_id, params} = this.props;
    const test_id = params.test_id;
    console.log("student_id params:"+student_id+' '+params);
    if(test_id){
      setTimeout(() => {
        this.props.getTestStuReward(student_id, test_id)
      }, 2000);
      
      // this.props.getTestRankingList(test_id);
      // this.props.getStuTestInfo(student_id,test_id);
    }else{
      alert("页面参数错误");
    }
  }

  renderKpRating(){
    const { delta_kp } = this.props;
    return (
      <List className="my-list">
        <Item>相关知识点</Item>
        {

          delta_kp.map((item) => {
            const t = item.kp_delta_rating >= 0 ? '+' + item.kp_delta_rating : item.kp_delta_rating;
            return (
              <Item extra={<Badge text={'+12'} />}>{item.kpname}
   
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
    var { delta_kp, delta_student_rating, student_rating, test_reward } = this.props;
    const {credit} = test_reward;
    const delta_student_rating_str = delta_student_rating > 0 ? '+' + delta_student_rating : delta_student_rating;

    return (
      <div>
      <div style={{backgroundColor: '#1890ff', paddingTop: '3rem',}}>
        <div style={{
              textAlign: 'center',
              height: '3rem',
              lineHeight: '3rem',
              color: 'white',
            }}>
              <span style={{fontSize: '3rem'}} >{student_rating}</span>
        
        </div>
        <div style={{
              textAlign: 'center',
              height: '2rem',
              lineHeight: '2rem',
              color: 'white',
              fontSize: '1.1rem'
            }}><span>{'荣耀战力'}</span><Badge text={delta_student_rating_str} size='large'  style={{
              marginLeft: 6, padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2}} /></div>
        <div style={{
        textAlign: 'center',
        height: '4rem',
        lineHeight: '4rem',
        color: 'white',
        fontSize: '1rem'
      }}>最近天梯 ></div>
      </div>

      <List>
        <Item>
          <div>倔强青铜<Rate count = {3} disabled defaultValue={2} /></div>
          <Brief><div style={{ width: '85%' }}><Circle size="small" type="line" percent={credit} format={() => '800/3400'}/></div> </Brief> 
          
        </Item>
      </List>
      <WhiteSpace />
      <List>
        <Item extra={'规则'}><div>学科积分+8</div></Item>
        <Item
          thumb={<Circle width={100} type="dashboard" percent={credit} format={() => credit + '/ 200'}/>} >
          
          <Brief><div>全对 +3</div><div>击破5题 +5</div></Brief>    
        </Item>
      </List>
      <WhiteSpace />
      {this.renderKpRating()}
      <WingBlank>
        <div style={{ margin: '18px 0 18px 0'}}>
          <Button className="btn" 
          onClick={e => this.getResult()} 
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
  delta_result = {
    delta_kp: [{kpname: "二次函数标准式与定义", kp_delta_rating: +12}],
    delta_student_rating: 39,
    student_rating: 800,
    delta_points: [{}],
  }
  return {
    student_id: 1,
    test_id: test_id,
    test_reward: test_reward,
    student_rating: delta_result.student_rating,
    delta_kp: delta_result.delta_kp,
    delta_student_rating: delta_result.delta_student_rating
  }; 
}, action)(KpTestResult);