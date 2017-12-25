import { Tabs, WhiteSpace, List, Badge, Button, ActivityIndicator,Flex } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';
import { Progress } from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';


class OverallAbility extends React.Component{
  constructor(props) {
    super(props);
    this.state={ capatity : capatity, ladder : ladder, activeKey : '1'};
  }
  componentDidMount(){
        var url1 = urlip+'getStuAbility';
        var url2 = urlip+'getStuLadder';
        NetUtil.get(url1, {student_id:this.props.student_id}, (results) => {
              console.log('results:'+JSON.stringify(results));
                // this.state.capatity = results;
                this.setState({capatity : results});                   
        }); 
        NetUtil.get(url2, {student_id:this.props.student_id}, (results) => {
                console.log('results:'+JSON.stringify(results));
                // this.state.ladder = results;
                this.setState({ladder : results});                   
        }); 
    }
  onTabChange(key){
    this.setState({activeKey : key});
  }
  render(){
    const {capatity,ladder,activeKey} = this.state;
    // console.log('this.state.ladder:'+JSON.stringify(ladder));
    if(capatity){
        return(
          <div>
            <div className="tab_content">
              <p className="p_tab_content">综合概况</p>
              <Tabs size='small' tabPosition='left' onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
                <TabPane tab="全部" key="1">
                  <Row type="flex" justify="start">
                    <Col span={5}><p className="p_header">练题数</p></Col>
                    <Col span={5}><p className="p_header">正确率</p></Col>
                    <Col span={5}><p className="p_header">天梯分</p></Col>
                  </Row>
                  <Row align="middle" type="flex" justify="start" className="row_content">
                    <Col span={5}><p className="p_content">{capatity[0].exercount}</p></Col>
                    <Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
                    <Col span={5}><p className="p_content">{capatity[0].ladderscore}</p></Col>
                  </Row>
                </TabPane>
                <TabPane tab="近20题" key="2">
                  <Row type="flex" justify="start">
                    <Col span={5}><p className="p_header">练题数</p></Col>
                    <Col span={5}><p className="p_header">正确率</p></Col>
                    <Col span={5}><p className="p_header">天梯分变化</p></Col>
                  </Row>
                  <Row align="middle" type="flex" justify="start" className="row_content">
                    <Col span={5}><p className="p_content">{capatity[1].exercount}</p></Col>
                    <Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
                    <Col span={5}><p className="p_content">{capatity[1].ladderscore>0? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore)}</p></Col>
                  </Row>
                </TabPane>
                <TabPane tab="近50题" key="3">
                  <Row type="flex" justify="start">
                    <Col span={5}><p className="p_header">练题数</p></Col>
                    <Col span={5}><p className="p_header">正确率</p></Col>
                    <Col span={5}><p className="p_header">天梯分变化</p></Col>
                  </Row>
                  <Row align="middle" type="flex" justify="start" className="row_content">
                    <Col span={5}><p className="p_content">{capatity[2].exercount}</p></Col>
                    <Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
                    <Col span={5}><p className="p_content">{capatity[2].ladderscore>0? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore)}</p></Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            <div className="d_ladder">
              <p className="p_ladder_title">天梯积分</p>
              <LadderScore ladder={ladder}/>
            </div>
            <div className="d_kp">
              <p className="p_d_kp">常练知识点</p>
              <ComUsedKp student_id={this.props.student_id}/>
            </div>
          </div>
        );
      }
  }
}

class OverallAbility extends React.Component{
  constructor(props) {
    super(props);
    this.state={ capatity : capatity, ladder : ladder, activeKey : '1'};
  }
  componentDidMount(){
        this.props.getStuAbility(this.props.student_id);
        this.props.getStuLadder(this.props.student_id);
  }
  onTabChange(key){
    this.setState({activeKey : key});
  }
  render(){
    const {capatity,ladder,activeKey} = this.state;
    // console.log('this.state.ladder:'+JSON.stringify(ladder));

    const tabs = [
      { title: '全部' },
      { title: '近20题' },
      { title: '近50题' },
    ];

    if(capatity){
        return(
          <div>
            <div className="tab_content">
              <p className="p_tab_content">综合概况</p>
              <Tabs size='small' tabPosition='left' onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
              <Tabs tabs={tabs}
                initalPage={'t2'}
                tabBarPosition="left"
                tabDirection="vertical"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                  <Flex justify="center">
                    <Flex.Item><p className="p_header">练题数</p></Flex.Item>
                    <Flex.Item><p className="p_header">正确率</p></Flex.Item>
                    <Flex.Item><p className="p_header">天梯分</p></Flex.Item>
                  </Flex>
                  <WhiteSpace size="lg" />
                  <Flex align="baseline">
                    <Flex.Item><p className="p_content">{capatity[0].exercount}</p></Flex.Item>
                    <Flex.Item><div className="p_content"><Progress type="circle" percent={capatity[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
                    <Flex.Item><p className="p_content">{capatity[0].ladderscore}</p></Flex.Item>
                  </Flex>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                  <Flex justify="center">
                    <Flex.Item><p className="p_header">练题数</p></Flex.Item>
                    <Flex.Item><p className="p_header">正确率</p></Flex.Item>
                    <Flex.Item><p className="p_header">天梯分变化</p></Flex.Item>
                  </Flex>
                  <WhiteSpace size="lg" />
                  <Flex align="baseline">
                    <Flex.Item><p className="p_content">{capatity[1].exercount}</p></Flex.Item>
                    <Flex.Item><div className="p_content"><Progress type="circle" percent={capatity[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
                    <Flex.Item><p className="p_content">{capatity[1].ladderscore>0? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore)}</p></Flex.Item>
                  </Flex>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                  <Flex justify="center">
                    <Flex.Item><p className="p_header">练题数</p></Flex.Item>
                    <Flex.Item><p className="p_header">正确率</p></Flex.Item>
                    <Flex.Item><p className="p_header">天梯分变化</p></Flex.Item>
                  </Flex>
                  <WhiteSpace size="lg" />
                  <Flex align="baseline">
                    <Flex.Item><p className="p_content">{capatity[2].exercount}</p></Flex.Item>
                    <Flex.Item><div className="p_content"><Progress type="circle" percent={capatity[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Flex.Item>
                    <Flex.Item><p className="p_content">{capatity[2].ladderscore>0? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore)}</p></Flex.Item>
                  </Flex>
                </div>
              </Tabs>
            </div>
            <WhiteSpace />
            <div className="d_ladder">
              <p className="p_ladder_title">天梯积分</p>
              <canvas id="ladderscore" width="600" height="400" ></canvas>
            </div>
            <div className="d_kp">
              <p className="p_d_kp">常练知识点</p>
              <ComUsedKp student_id={this.props.student_id}/>
            </div>
          </div>
        );
      }
  }
}


class StuStatus extends React.Component {
  constructor(props) { 
  	super(props);
    alert(window.innerWidth);
  }

  componentDidMount(){
    this.loadTest();
  }

  loadTest(){
    // var student_id = '1';
    this.props.getMyTestList(this.props.student_id);
  }

  callback(key) {
  	console.log('onChange', key);
  }

  handleTabClick(key) {
  	console.log('onTabClick', key);
  }

  render() {
    var {isFetching, my_test_list} = this.props;
    var finish_test = [], not_finish_test = [];
    if(my_test_list){
      for(var i = 0; i < my_test_list.length; i++){
        if(my_test_list[i].finish_time){
          finish_test.push(my_test_list[i]);
        }else{
          not_finish_test.push(my_test_list[i]);
        }
      }
    }

    var finish_item = finish_test.map((item,i) => {
        var time = item.enable_time;
        return(
          <Item arrow="horizontal" multipleLine extra={item.teacher_id} onClick={e => this.props.router.push("/mobile-test/TestStatus/"+ item.test_id)}>
            {item.test_name}
            <Brief>{item.enable_time}</Brief>
          </Item>
      );
    });
    var not_finish_item = not_finish_test.map((item,i) => {
        console.log(item);

        var time = item.enable_time;
        return(
          <Item arrow="horizontal" multipleLine extra={item.teacher_id} onClick={e => this.props.router.push("/mobile-test/TestStatus/"+ item.test_id)}>
            {item.test_name}
            <Brief>{item.enable_time}</Brief>
          </Item>
      );
    });
    return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff', fontSize: '1rem' }}>
          我的任务
      </div>
      <ActivityIndicator toast animating={this.props.isFetching} />
      <Tabs defaultActiveKey="1" onChange={this.callback} onTabClick={this.handleTabClick}>
        <TabPane tab="综合能力" key="1"> 
          <OverallAbility />
        </TabPane>
        <TabPane tab="近期表现" key="2">
        	<RecentKp />
        </TabPane>
        <TabPane tab="知识点能力" key="3">
          <KpAbility />
        </TabPane>
      </Tabs>
        
      <WhiteSpace />

    </div>
    
    );
  }
}

export default connect(state => {
  const student_status = state.stuStatus.toJS();
  console.log(student_status);
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
    capatity : capatity ? capatity : default_capatity,
    ladder : ladder ? ladder : default_ladder,
    student_id: "1",//state.AuthData.get('userid'), 
  }
}, action)(MyTest);