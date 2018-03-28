import { Progress, WhiteSpace, WingBlank, List, Button, NavBar, ActivityIndicator, Flex,Icon } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress as Circle} from 'antd';


import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;

const F2 = require('@antv/f2');

class StudentKp extends React.Component {
  constructor(props) { 
  	super(props);
    this.state = { kpladder : []};
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const kpid = params.kpid;
    // const kpid = "167772686";
    console.log("student_id params:"+student_id+' '+params);
    if(kpid){
        this.props.getStuKpLadder(student_id, kpid);
        this.props.getStuKpAbility(student_id, kpid);
        this.props.updateEntry("root");
        this.props.getMyLadderScore(student_id);
      // this.props.getTestRankingList(test_id);
      // this.props.getStuTestInfo(student_id,test_id);
    }else{
      alert("页面参数错误");
    }
  }


  renderKpAbility(){
    const {kpcapatity} = this.props;
    if(kpcapatity.length){
      return (
        <Flex justify="center" style={{marginBottom:"1rem"}}> 
            <Flex.Item>
              <div style={{
                textAlign: 'center',
                height: '3rem',
                lineHeight: '3rem',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '1rem',
              }} >能力值</div>
              <div style={{
                    textAlign: 'center',
                    height: '4rem',
                    lineHeight: '4rem',
                    width: '100%',
                    color: '#1890ff',
                    fontSize: '1.5rem',
                  }} >{kpcapatity[0].kp_rating}</div>  
              </Flex.Item>
              <Flex.Item><div style={{
                textAlign: 'center',
                height: '3rem',
                lineHeight: '3rem',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '1rem',
              }} >正确率</div>
              <div style={{
                    textAlign: 'center',
                    height: '4rem',
                    lineHeight: '4rem',
                    width: '100%',
                    fontSize: '1rem',
                  }}><Circle type="circle" percent={kpcapatity[0].practice ? ((kpcapatity[0].correct/kpcapatity[0].practice)*100).toFixed(0) : 0} width={60} format={(percent) => `${percent}%`}/></div>
              </Flex.Item>
              <Flex.Item><div style={{
                textAlign: 'center',
                height: '3rem',
                lineHeight: '3rem',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '1rem',
              }} >练习次数</div>
              <div style={{
                    textAlign: 'center',
                    height: '4rem',
                    lineHeight: '4rem',
                    width: '100%',
                    color: '#1890ff',
                    fontSize: '1.5rem',
                  }} >{kpcapatity[0].practice}</div>  
              </Flex.Item>
        </Flex>
      );
    }
  }

  renderKpContent(){
      const {kpcapatity} = this.props;
      if(kpcapatity.length){
        return(    
          <List>
            <Item>
              <div style={{fontWeight: 'bold'}}>知识点攻略</div>
            </Item>
            <Item arrow='horizontal' multipleLine>
              等音程百科
              <Brief>两个音程的音响相同，记法和意义不同，就称为等音程。等音程是由于等音变化而来的，其重要特点是音数相等。可以只改变一个音的记谱，也可以两个音同时变换记谱。</Brief>
            </Item>
          </List>
        ); 
      }
  }
  
  render() {
    const {kpcapatity, student_id, params} = this.props;
    const kpid = params.kpid;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={e => this.props.router.push("/mobile-zq/")}
        >音程复习课二</NavBar>
        <div>
          <div style={{backgroundColor: '#fff', paddingTop: '2rem', paddingBottom: '0.5rem', color: 'white'}}>
            <div style={{
              textAlign: 'left',
              height: '1rem',
              marginLeft: '2rem',
              lineHeight: '1rem',
              fontSize: '1rem'
            }}>
              课程时间：2018-03-09
            </div>

            <div style={{
              textAlign: 'left',
              height: '1rem',
              marginLeft: '2rem',
              lineHeight: '1rem',
              fontSize: '1rem'
            }}>
              时长：40分钟
            </div>

            <div style={{
              textAlign: 'left',
              height: '1rem',
              marginLeft: '2rem',
              lineHeight: '1rem',
              fontSize: '1rem'
            }}>
              老师：欧超智
            </div>
          </div>
          <List>
            <Item>
              
            </Item>
          </List> 
          {this.renderKpAbility()}
          <List>
            <Item>
              <div style={{fontWeight: 'bold'}}>能力值变化情况</div>
            </Item>
          </List> 
          <canvas id="c1" style={{width: "95%", height: "60%"}}></canvas>
          <WhiteSpace size='lg'/>
          <WingBlank>
          <Button style={{marginTop: '0.5rem'}} type="primary"
            onClick={ e => this.props.getTestDataByKp(student_id, kpid, kpcapatity[0].kpname)} >
              继续修炼
          </Button>
          </WingBlank>
          <WhiteSpace size='lg'/>
          {this.renderKpContent()}
        </div>
        
      </div>
    );
  }
}

export default connect(state => {
  const student_status = state.stuStatus.toJS();
  console.log('student_status'+JSON.stringify(student_status));
  const {kpladder,kpcapatity} = student_status;
  const default_kpcapatity = [{
      kp_rating: 500,
      practice: 2,
      correct: 1,
    }];
  const default_comusedkp = [{kpid:'1',kpname:'二次函数',usedcount:'5',rate : 56}];
  return {
    isFetching : student_status.isFetching,
    kpcapatity : kpcapatity ? kpcapatity : default_kpcapatity,
    kpladder : kpladder ? kpladder : [],
    student_id: state.AuthData.get('userid'), 
  }
}, action)(StudentKp);