import { SegmentedControl, WhiteSpace, List, Badge, Button, ActivityIndicator,Flex } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress } from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;


class StudentStatus extends React.Component {
  constructor(props) { 
  	super(props);
    alert(window.innerWidth);
    this.state = {selectedIndex : 0};
  }

  componentDidMount(){
     this.props.getStuAbility(this.props.student_id);
     this.props.getStuComUsedKp(this.props.student_id);
     // this.props.getStuLadder(this.props.student_id);
  }

  onChange(e){
     this.setState({selectedIndex : e.nativeEvent.selectedSegmentIndex});
  }
  renderOneAbility(){
    const {capatity,ladder} = this.props;
    switch(this.state.selectedIndex){
      case 0 : 
        return (
          <div>
            <Flex justify="center">
              <Flex.Item>练题数</Flex.Item>
              <Flex.Item>正确率</Flex.Item>
              <Flex.Item>天梯分</Flex.Item>
            </Flex>
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><p>{capatity[0].exercount}</p></Flex.Item>
              <Flex.Item><div><Progress type="circle" percent={capatity[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><p>{capatity[0].ladderscore}</p></Flex.Item>
            </Flex>
          </div>
        );
      case 1 : 
        return (
          <div>
            <Flex justify="center">
              <Flex.Item><p>练题数</p></Flex.Item>
              <Flex.Item><p>正确率</p></Flex.Item>
              <Flex.Item><p>天梯分变化</p></Flex.Item>
            </Flex>
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><p>{capatity[1].exercount}</p></Flex.Item>
              <Flex.Item><div><Progress type="circle" percent={capatity[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><p>{capatity[1].ladderscore>0? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore)}</p></Flex.Item>
            </Flex>
          </div>
        );
      case 2 : 
        return (
          <div>
            <Flex justify="center">
              <Flex.Item><p>练题数</p></Flex.Item>
              <Flex.Item><p>正确率</p></Flex.Item>
              <Flex.Item><p>天梯分变化</p></Flex.Item>
            </Flex>
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><p>{capatity[2].exercount}</p></Flex.Item>
              <Flex.Item><div><Progress type="circle" percent={capatity[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><p>{capatity[2].ladderscore>0? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore)}</p></Flex.Item>
            </Flex>
          </div>
        );
      default:
        return ;
    }
  }

  renderOverallAbility(){
    const {capatity,ladder} = this.props;

    if(capatity.length > 0){
      return(
        <div>
          <div>
            <SegmentedControl
              values={['全部', '近20题', '近50题']}
              style={{ height: '30px', width: '180px' }}
              onChange={(e) => this.onChange(e)}
            />
            {this.renderOneAbility()}
          </div>
          <WhiteSpace />
        </div>
      ); 
    }
  }

  renderComUsedKp(){
      const {comusedkp} = this.props;
      if(comusedkp.length > 0){
      return(
          <div>
            <div>
              <List renderHeader={() => '最近练习知识点'}>
                <Item extra={'练习次数/天梯分'}>知识点/正确率</Item>
                {
                  comusedkp.map((item) => {
                    return (
                      <Item extra={item.usedcount} multipleLine>
                        {item.kpname}
                        <Brief>
                          <div><Progress size="small" percent={item.rate} format={(percent) => `${percent}%`}/></div>
                        </Brief>
                      </Item>
                    )
                  })
                }
              </List>
            </div>
            <WhiteSpace />
          </div>
        ); 
      }
  }
  
  render() {
    console.log('this.props 1:'+JSON.stringify(this.props));
    return (
      <div>
        <div>
          {this.renderOverallAbility()}
          {this.renderComUsedKp()}
        </div>
        <WhiteSpace />
      </div>
    );
  }
}

export default connect(state => {
  const student_status = state.stuStatus.toJS();
  console.log('student_status'+JSON.stringify(student_status));
  const {capatity , ladder, comusedkp} = student_status;
  const default_capatity = [{
      key: '1',
      exercount: 560,
      rate: 89.4,
      ladderscore: 1800,
    }, {
      key: '2',
      exercount: 20,
      rate: 88,
      ladderscore: 1780,
    }, {
      key: '3',
      exercount: 50,
      rate: 91,
      ladderscore: 1884,
    }, 
  ];
  const default_ladder = [{procount:10,score:1600},{procount:11,score:1605},{procount:12,score:1608}
       ,{procount:13,score:1615},{procount:14,score:1611},{procount:15,score:1609}];
  const default_comusedkp = [{kpid:'1',kpname:'二次函数',usedcount:'5',rate : 56}];
  return {
    isFetching : student_status.isFetching,
    capatity : capatity.length > 0 ? capatity : default_capatity,
    ladder : ladder.length > 0 ? ladder : default_ladder,
    comusedkp : comusedkp.length > 0 ? comusedkp : default_comusedkp,
    student_id: state.AuthData.get('userid'), 
  }
}, action)(StudentStatus);