import { Tabs, WhiteSpace, List, Badge, Button, ActivityIndicator,Flex } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress } from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';


class StudentStatus extends React.Component {
  constructor(props) { 
  	super(props);
    alert(window.innerWidth);
  }

  componentDidMount(){
     this.props.getStuAbility(this.props.student_id);
     this.props.getStuLadder(this.props.student_id);
  }

  renderOverallAbility(){
    const {capatity,ladder} = this.props;

    const tabs = [
      { title: '全部' },
      { title: '近20题' },
      { title: '近50题' },
    ];

    return(
      <div>
        <div>
          <p>综合概况</p>
          <Tabs tabs={tabs}
            initalPage={'2'}
            tabBarPosition="left"
            tabDirection="vertical"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
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
          </Tabs>
        </div>
        <WhiteSpace />
      </div>
    ); 
    
  }
  
  render() {
    console.log('this.props 1:'+JSON.stringify(this.props));
    return (
      <div>
        <div>
          {this.renderOverallAbility()}
        </div>
        <WhiteSpace />
      </div>
    );
  }
}

export default connect(state => {
  const student_status = state.stuStatus.toJS();
  console.log('student_status'+JSON.stringify(student_status));
  const {capatity , ladder} = student_status;
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
  return {
    isFetching : student_status.isFetching,
    // capatity : capatity ? capatity : default_capatity,
    // ladder : ladder ? ladder : default_ladder,
    capatity : default_capatity,
    ladder :  default_ladder,
    student_id: "1",//state.AuthData.get('userid'), 
  }
}, action)(StudentStatus);