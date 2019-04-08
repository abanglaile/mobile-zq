import { WhiteSpace, WingBlank, List, Button, NavBar, ActivityIndicator, Flex, Icon, Toast } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
// import Tex from './renderer.js';
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
        this.props.getKpRatingHistory(student_id, kpid);
        this.props.getKpAbility(student_id, kpid);
        // this.props.updateEntry("/student_kp/");
        // this.props.getMyLadderScore(student_id);
      // this.props.getTestRankingList(test_id);
      // this.props.getStuTestInfo(student_id,test_id);
    }else{
      alert("页面参数错误");
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({kpladder : nextProps.kpladder},() => {
      if(nextProps.kpladder.length > 0){
        this.renderF2();
      }
    });
  }

  renderF2(){
    const data = this.state.kpladder;
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
      kp_rating: {
        tickCount: 3,
        min: 100  
      }
    };
    // 配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
    chart.axis('kp_rating', {
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

    chart.area().position('update_time*kp_rating')
      .color(linear_gradient)
      .style({
        opacity: 0.6
      });

    
    chart.line().position('update_time*kp_rating').size(2);
    chart.render();
  }

  renderKpAbility(){
    const {kpcapatity} = this.props;
    console.log(kpcapatity);
//    if(kpcapatity.length){
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
                  }} >{kpcapatity.kp_rating ? kpcapatity.kp_rating : '未评测'}</div>  
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
                  }}><Circle type="circle" percent={kpcapatity.practice ? ((kpcapatity.correct/kpcapatity.practice)*100).toFixed(0) : 0} width={60} format={(percent) => `${percent}%`}/></div>
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
                  }} >{kpcapatity.practice ? kpcapatity.practice : 0}</div>  
              </Flex.Item>
        </Flex>
      );
//    }
  }

  renderKpContent(){
      const {kpcapatity} = this.props;
      if(kpcapatity){
        return(    
          <List>
            <Item>
              <div style={{fontWeight: 'bold'}}>知识点小百科</div>
            </Item>
            <a href="http://mp.weixin.qq.com/s?__biz=MzI5OTAyNjU4Mg==&tempkey=OTUyX2FYTk91SEhhM0lrZFRPdXFJRnBLZ0E4TXJTaDBZSUJPd2JFNVNjb0J6SHgtbWJXdEkxZ1VBeTdaVmdJZk4xY3laTUVkdTI3cS0tbERGLXZkTmpBVE1mNzY2RnlZU2w1b3N5MzhlZ1F2OFA5LTVWdjNTYkY1dDRDYjVzbmZpMHJTc2ozbmlNVW5sUjNGa2NqZGtaTGFaU1VVMkxzU1V0TTNFX1FkTUF%2Bfg%3D%3D&chksm=7484999643f3108026abb65ab301827cde9deca9693d46b7b4981eae0be8f68b1f8519155a62&mpshare=1&scene=1&srcid=0418UrKfbDg5X2axXkgu9vAq#wechat_redirect">
              <Item arrow='horizontal' multipleLine >
                单音程
                <Brief>在乐音体系中，两个音之间的高低关系，叫做“音程”。其中，较高的音称为冠音（上方音），较低的音称为根音（下方音）。</Brief>
              </Item>
            </a>
          </List>
        ); 
      }
  }

  onLeftClick(){
    this.props.router.goBack();
  }
  
  render() {
    const {kpcapatity, student_id, params, isFetching} = this.props;
    const kpid = params.kpid;
    if(isFetching){
      Toast.loading("正在加载", 0);
    }else{
      Toast.hide();
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={e => this.props.router.goBack()}
        >{kpcapatity ? kpcapatity.kpname : ''}</NavBar>
        <div>
          <div style={{backgroundColor: '#f5f5f5', paddingTop: '2rem', paddingBottom: '0.5rem', color: '#1890ff'}}>
            <div style={{
              textAlign: 'left',
              height: '3rem',
              marginLeft: '2rem',
              lineHeight: '3rem',
              fontSize: '1.5rem'
            }}>
              {kpcapatity ? kpcapatity.kpname : ''}
            </div>
          
          <div style={{
            textAlign: 'left',
            height: '3rem',
            marginLeft: '2rem',
            lineHeight: '3rem',
            fontSize: '1rem'
            }}>{kpcapatity? kpcapatity.chaptername : ''} ></div>
          </div>
          <List>
            <Item>
              <div style={{fontWeight: 'bold'}}>知识点概况</div>
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
            disabled
            onClick={ e => this.props.generateTestByKp(student_id, kpid, kpcapatity.kpname)} >
              {kpcapatity ? "继续修炼" : "开始修炼"}
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
  const student_data = state.studentData.toJS();
  const {isFetching,kpladder,kpcapatity} = student_data;
  const default_kpcapatity = [{
      kp_rating: 500,
      practice: 2,
      correct: 1,
    }];
  return {
    isFetching : student_data.isFetching,
    kpcapatity : kpcapatity,
    kpladder : kpladder ? kpladder : [],
    student_id: state.AuthData.get('userid'), 
  }
}, action)(StudentKp);
