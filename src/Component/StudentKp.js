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

class StudentKp extends React.Component {
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
      { time: '2016-08-08 01:00:00', score: 330},
      { time: '2016-08-09 01:20:00', score: 400},
      { time: '2016-08-10 01:40:00', score: 470},
      { time: '2016-08-10 02:00:00', score: 460},
      { time: '2016-08-11 02:20:00', score: 405}
  ];

  const chart = new F2.Chart({
    id: 'c1',
    pixelRatio: window.devicePixelRatio
  });

  const defs = {
    time: {
      type: 'timeCat',
      tickCount: 2,
      range: [ 0.1, 1 ]
    },
    score: {
      tickCount: 5,
      min: 300  
    }
  };
  // 配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
  chart.axis('score', {
    label: {
      textAlign: 'start',
      textBaseline: 'bottom',
      offset: 0,
      fontSize: 14
    }
  });
  const label = {
    fill: '#979797',
    font: '14px san-serif',
    offset: 6
  };
  chart.axis('time', {
    label(text, index, total) {
      const cfg = label;
      // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
      if (index === 0) {
        cfg.textAlign = 'start';
      }
      if (index > 0 && index === total - 1) {
        cfg.textAlign = 'end';
      }
      return cfg;
    }
  });
  chart.source(data, defs);
  // 绘制渐变色区域图
  const canvas = document.getElementById('c1');
  const linear_gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 500);
  linear_gradient.addColorStop(0.3, '#fff');
  linear_gradient.addColorStop(0, 'rgb(15, 141, 232)');

  chart.area().position('time*score')
    .color(linear_gradient)
    .style({
      opacity: 0.6
    });

  
  chart.line().position('time*score').size(2);
  chart.render();
  }

  renderKpAbility(){
    const {capatity,ladder} = this.props;
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
            <Item>
              <div style={{fontWeight: 'bold'}}>知识点概况</div>
            </Item>
          </List> 
          {this.renderKpAbility()}
          <List>
            <Item>
              <div style={{fontWeight: 'bold'}}>掌握度变化情况</div>
            </Item>
          </List> 
          <canvas id="c1" style={{width: "95%", height: "60%"}}></canvas>
          <WhiteSpace size='lg'/>
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
}, action)(StudentKp);