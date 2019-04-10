import { SegmentedControl, Progress, WhiteSpace, List, Badge, Button,NavBar,ActivityIndicator,Flex,Icon } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { Progress as Circle} from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;

const F2 = require('@antv/f2');


class StudentStatus extends React.Component {
  constructor(props) { 
  	super(props);
    this.state = {selectedIndex : 0, ladder : []};
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const course_id = params.course_id;
    console.log("course_id :",course_id);
    this.props.getStuAbility(this.props.student_id, course_id);
    this.props.getStuRatingHistory(this.props.student_id, course_id);
    //  this.props.getStuComUsedKp(this.props.student_id);
  }

  componentWillReceiveProps(nextProps){
    this.setState({rating_history : nextProps.rating_history},() => {
      if(nextProps.rating_history.length > 0){
        this.renderF2();
      }
    });
  }

  renderF2(){
    const data = this.state.rating_history;
    console.log("data:"+JSON.stringify(data));

    const chart = new F2.Chart({
      id: 'c1',
      pixelRatio: window.devicePixelRatio
    });

    const defs = {
      update_time: {
        type: 'timeCat',
        tickCount: 2,
        range: [ 0, 1 ]
      },
      student_rating: {
        tickCount: 5,
        min: 300  
      }
    };
    // 配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
    chart.axis('student_rating', {
      label: {
        textAlign: 'end',
        offset: 0,
        fontSize: 14
      }
    });
    const label = {
      fill: '#979797',
      font: '14px san-serif',
      offset: 6
    };
    chart.axis('update_time', {
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

    chart.area().position('update_time*student_rating')
      .color(linear_gradient)
      .style({
        opacity: 0.6
      });

    
    chart.line().position('update_time*student_rating').size(2);
    chart.render();
  }

  onChange(e){
    console.log(e.nativeEvent.selectedSegmentIndex);
     this.setState({selectedIndex : e.nativeEvent.selectedSegmentIndex});
  }
  renderOneAbility(){
    const {capatity, rating_history} = this.props;
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
                }} >{capatity[1].ladderscore ? (capatity[1].ladderscore>0) ? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore) : ''}</div></Flex.Item>
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
                }} >{capatity[2].ladderscore ? (capatity[2].ladderscore>0) ? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore) : ''}</div></Flex.Item>
            </Flex>
          </div>
        );
      default:
        return ;
    }
  }

  renderOverallAbility(){
    const {capatity,ladder} = this.props;
    console.log("capatity",JSON.stringify(capatity));

    if(capatity.length > 0){
      return(
        <div style={{backgroundColor:"white"}}>
          <div style={{color: '#108ee9',fontSize:'1rem',margin:"15px 15px"}}>综合概况</div>
          <div style={{marginTop:"10px",marginBottom:"1rem"}}>
            <SegmentedControl
              values={['全部', '近20题', '近50题']}
              selectedIndex = {this.state.selectedIndex}
              style={{ height: '30px', width: '250px',margin:'0px 0 10px 60px'}}
              onChange={(e) => this.onChange(e)}
            />
            <WhiteSpace />
            {this.renderOneAbility()}
          </div>
          <WhiteSpace style={{backgroundColor:"#f5f5f5"}}/>
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
              <List renderHeader={<div style={{color: '#108ee9',fontSize:'1rem'}}>最近练习知识点</div>}>
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
  
  render() {
    const {isFetching} = this.props;

    if(isFetching){  
        return (<ActivityIndicator toast animating={isFetching} /> );  
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={e => this.props.router.push("/mobile-zq/root/my_book_chapter")}
        >我的能力</NavBar>
        <div>
          <WhiteSpace style={{backgroundColor:"#f5f5f5"}}/>
          {this.renderOverallAbility()}
          <div>
            <div style={{color: '#108ee9',fontSize:'1rem',margin:"15px 15px"}}>天梯分变化情况</div> 
            <canvas id="c1" style={{width: "95%", height: "60%"}}></canvas>
          </div>
        </div>
        <WhiteSpace />
      </div>
    );
  }
}

export default connect(state => {
  const student_status = state.studentData.toJS();
  const {capatity , rating_history, comusedkp, isFetching} = student_status;
  const default_capatity = [{
      key: '1',
      exercount: 0,
      rate: 0,
      ladderscore: null,
    }, {
      key: '2',
      exercount: 0,
      rate: 0,
      ladderscore: null,
    }, {
      key: '3',
      exercount: 0,
      rate: 0,
      ladderscore: null,
    }, 
  ];

  const default_comusedkp = [{kpid:'1',kpname:'二次函数',usedcount:'5',rate : 56}];
  return {
    isFetching : isFetching,
    capatity : capatity.length > 0 ? capatity : default_capatity,
    rating_history : rating_history ? rating_history : [],
    // comusedkp : comusedkp.length > 0 ? comusedkp : default_comusedkp,
    student_id: state.AuthData.get('userid'), 
  }
}, action)(StudentStatus);