import { SegmentedControl, Progress, WhiteSpace, List, Badge, Button,NavBar,ActivityIndicator,Flex } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress as Circle} from 'antd';

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
    console.log(e.nativeEvent.selectedSegmentIndex);
     this.setState({selectedIndex : e.nativeEvent.selectedSegmentIndex});
  }
  renderOneAbility(){
    const {capatity,ladder} = this.props;
    var abilityheaderDom = (<Flex justify="center">
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }} >练题数</div></Flex.Item>
                <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }} >正确率</div></Flex.Item>
                <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }} >天梯分</div></Flex.Item>
            </Flex>);

    switch(this.state.selectedIndex){
      case 0 : 
        return (
          <div>
            {abilityheaderDom}
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[0].exercount}</div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }}><Circle type="circle" percent={capatity[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[0].ladderscore}</div></Flex.Item>
            </Flex>
          </div>
        );
      case 1 : 
        return (
          <div>
            {abilityheaderDom}
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[1].exercount}</div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }}><Circle type="circle" percent={capatity[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[1].ladderscore>0? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore)}</div></Flex.Item>
            </Flex>
          </div>
        );
      case 2 : 
        return (
          <div>
            {abilityheaderDom}
            <WhiteSpace size="lg" />
            <Flex align="baseline">
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[2].exercount}</div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }}><Circle type="circle" percent={capatity[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
              <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '3rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontSize: '1rem',
                }} >{capatity[2].ladderscore>0? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore)}</div></Flex.Item>
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
        <div style={{backgroundColor:"white"}}>
          <div>
            <SegmentedControl
              values={['全部', '近20题', '近50题']}
              selectedIndex = {this.state.selectedIndex}
              style={{ height: '30px', width: '250px',margin:'0px 0 10px 60px'}}
              onChange={(e) => this.onChange(e)}
            />
            <WhiteSpace />
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
                {
                  comusedkp.map((item) => {
                    return (
                      <Item multipleLine>
                        {item.kpname}
                        <div style={{display: 'flex', marginTop: '0.5rem', alignItems: 'center'}}>
                          <Progress style={{width: '60%'}} percent={item.rate} position="normal" />
                          <div style={{fontSize: '1rem', marginLeft: '1rem'}}>{item.rate}%</div>
                        </div>
                        <Brief><div>练习{item.usedcount ? item.usedcount : 0}次</div></Brief>
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

  renderAllKp(){
    return(
        <div>
          <List>
            <Item arrow="horizontal" onClick={e => this.props.router.push("/mobile-zq/my_book_chapter/")}>
              所有知识点
            </Item>
          </List>
          <WhiteSpace />
        </div>
      ); 
  }
  
  render() {
    console.log('this.props 1:'+JSON.stringify(this.props));
    return (
      <div>
        <NavBar
          mode="light"
        >学情</NavBar>
        <div>
          {this.renderOverallAbility()}
          {this.renderComUsedKp()}
          {this.renderAllKp()}
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