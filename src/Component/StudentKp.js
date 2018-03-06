import { SegmentedControl, Progress, WhiteSpace, WingBlank, List, Button, NavBar, ActivityIndicator, Flex } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress as Circle} from 'antd';


import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;

const F2 = require('@antv/f2');

class StudentStatus extends React.Component {
  constructor(props) { 
  	super(props);
    this.state = {selectedIndex : 0};
  }

  componentDidMount(){
     this.renderF2();
     // this.props.getStuAbility(this.props.student_id);
     // this.props.getStuComUsedKp(this.props.student_id);
     // // this.props.getStuLadder(this.props.student_id);
  }

  renderF2(){
    const data = [
    { time: '2016-08-08 00:00:00', tem: 10 },
    { time: '2016-08-08 00:10:00', tem: 22 },
    { time: '2016-08-08 00:30:00', tem: 20 },
    { time: '2016-08-09 00:35:00', tem: 26 },
    { time: '2016-08-09 01:00:00', tem: 20 },
    { time: '2016-08-09 01:20:00', tem: 26 },
    { time: '2016-08-10 01:40:00', tem: 28 },
    { time: '2016-08-10 02:00:00', tem: 20 },
    { time: '2016-08-10 02:20:00', tem: 28 }
  ];

  const chart = new F2.Chart({
    id: 'c1',
    pixelRatio: window.devicePixelRatio
  });

  const defs = {
    time: {
      type: 'timeCat',
      mask: 'MM/DD',
      tickCount: 3,
      range: [ 0, 1 ]
    },
    tem: {
      tickCount: 5,
      min: 0
    }
  };
  // 配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
  chart.axis('tem', {
    label: {
      fontSize: 14
    }
  });
  chart.axis('time', {
    label: {
      fontSize: 14
    }
  });
  chart.source(data, defs);
  chart.line().position('time*tem');
  chart.render();
  }

  renderKpAbility(){
    const {capatity,ladder} = this.props;
    return (
      <Flex justify="center">
          <Flex.Item>
            <div style={{
              textAlign: 'center',
              height: '3rem',
              lineHeight: '3rem',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '1rem',
            }} >掌握度</div>
            <div style={{
                  textAlign: 'center',
                  height: '4rem',
                  lineHeight: '4rem',
                  width: '100%',
                  color: '#1890ff',
                  fontSize: '1.5rem',
                }} >461</div>  
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
                }}><Circle type="circle" percent={52} width={60} format={(percent) => `${percent}%`}/></div>
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
                }} >106</div>  
            </Flex.Item>
      </Flex>
    );
  }

  renderKpContent(){
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
      ) 
  }
  
  render() {
    console.log('this.props 1:'+JSON.stringify(this.props));
    return (
      <div>
        <NavBar
          mode="light"
        >等音程</NavBar>
        <div>
          <div style={{backgroundColor: '#1890ff', paddingTop: '2rem', paddingBottom: '0.5rem', color: 'white'}}>
            <div style={{
              textAlign: 'left',
              height: '3rem',
              marginLeft: '2rem',
              lineHeight: '3rem',
              fontSize: '2rem'
            }}>
              等音程
            </div>
          
          <div style={{
            textAlign: 'left',
            height: '3rem',
            marginLeft: '2rem',
            lineHeight: '3rem',
            fontSize: '1rem'
            }}>音程 ></div>
          </div>
          <List>
            <Item extra='查看详细' arrow='horizontal'>
              <div style={{fontWeight: 'bold'}}>知识点情况</div>
            </Item>
          </List> 
          {this.renderKpAbility()}
          <canvas id="c1" style={{width: "90%", height: "40%"}}></canvas>
          
          <WhiteSpace size='xl'/>
          <WingBlank>
          <Button style={{marginTop: '0.5rem'}} type="primary"
            onClick={ e => this.props.router.push("/mobile-zq/mytest/")} >
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