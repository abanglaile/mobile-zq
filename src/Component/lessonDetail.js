import { Progress, WhiteSpace, WingBlank, List, Button, NavBar, ActivityIndicator, Badge, Flex,Icon } from 'antd-mobile';
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

  }


  
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={e => this.props.router.push("/mobile-zq/")}
        >音程复习课二</NavBar>
        <div>
          <div style={{backgroundColor: '#fff', paddingTop: '2rem', paddingBottom: '0.5rem'}}>
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
              欧超智 40分钟
            </div>

          </div>
          <WingBlank />
          <List>
            <Item extra="extra content" thumb="https://zos.alipayobjects.com/rmsportal/faMhXAxhCzLvveJ.png">
              <span>欧蕉蕉</span><span>#课程反馈</span>
            </Item>
            <Item multipleLine wrap>
              <div style={{marginLeft: '2rem'}}>上课认真，作业也完成了！继续加油！老师爱你们！</div>
            </Item>
          </List>
          <List>
            <Item>
              <div>单音程的识别与构成</div>
              <Brief>
                <Badge text="新学" style={{ marginLeft: 12, borderRadius: 2 }} />
                <Badge text="例题" hot style={{ marginLeft: 12 }} />
              </Brief>
            </Item>
          </List>  
          <WhiteSpace size='lg'/>
          <WingBlank />
        </div>
        
      </div>
    );
  }
}

export default connect(state => {

}, action)(StudentKp);