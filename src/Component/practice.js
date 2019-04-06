import { Tabs, WhiteSpace, List, Icon, Button, NavBar,Modal,Progress,ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
// import Tex from './renderer.js';

import *as action from '../Action/index';
import {connect} from 'react-redux';

const Item = List.Item;
const Brief = Item.Brief;

const server_url = "http://127.0.0.1:3000";

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

class MyTest extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      modal: false,
    };
  }

  componentDidMount(){
    const {student_id} = this.props;
    this.props.getNotFinishTest(this.props.student_id);
    this.props.setSelectedTab("blueTab");
    this.props.updateEntry("root");
    this.props.getStuPoorKp(this.props.student_id);
  }

  // getMyPoorKp(){
  //   this.props.getStuPoorKp(this.props.student_id);
  //   this.setState({modal: true});
  // }

  render() {
    var {isFetching, my_uncompleted_test, student_id, poorkp} = this.props;
    console.log("poorkp",JSON.stringify(poorkp));
    var not_finish_item = null;
    if(my_uncompleted_test){
      not_finish_item = my_uncompleted_test.map((item,i) => {
        var time = item.enable_time;
        return(
          <Item 
            multipleLine 
            extra={<Button type="primary" size='small' inline>开始</Button>}
            onClick={e => this.props.router.push("/mobile-zq/question/"+item.test_id)}
            style = {{border:"1px solid #888",borderRadius: "5px",margin :"1rem 1rem"}}
          >
            {item.test_name}
            <Brief>
              <span style={{paddingRight : "1rem",borderRight:"1px solid "}}>
                {item.total_exercise}题
              </span>
              <span style={{paddingLeft : "1rem"}}>
                {item.formatdate}
              </span>
              <span style={{paddingLeft : "1rem"}}>
                {item.nickname}
              </span>
            </Brief> 
          </Item>
        );
      });
    }else{
      not_finish_item = (
        <div>
          <Item 
              multipleLine 
              extra={<Button type='ghost' size='small' inline>加入班级</Button>}
          >
            加入班级才可查看作业
            <Brief>
              输入班级码一起提分吧
            </Brief> 
          </Item>
        </div>
      );
    }
    
    if(isFetching){  
        return (<ActivityIndicator toast animating={isFetching} /> );  
    }
    
    return (
    <div>
      <NavBar
          mode="light"
        >提分</NavBar>
      <div>
        <List>
          <Item>
            提分计划
          </Item>
          <Item 
            extra={<Button type='ghost' size='small' inline>继续</Button>}
            onClick={() => this.setState({modal: true})}
            style = {{border:"1px solid #888",borderRadius: "5px",margin :"1rem 1rem"}}
          >
            薄弱知识点
            <Brief>{"已掌握0/" + poorkp.length}</Brief>
          </Item>
        </List>
      </div>
      <Modal
          title='薄弱知识点'
          transparent
          visible={this.state.modal}
          onClose
          footer={[{ text: '确定', onPress: () => { this.setState({modal: false})} }]}
        >
          <List renderHeader={() => '以下知识点需要提高'}>
            {
              poorkp.map((item) => {
                var holdrate = ((item.kp_rating/(item.kp_standard? item.kp_standard : 1000))*100).toFixed(1);
                return (
                  <Item 
                    arrow="horizontal"
                    multipleLine
                    onClick={e => this.props.router.push("/mobile-zq/student_kp/"+item.kpid)}>
                    {item.kpname}
                    <div style={{marginTop:'0.4rem',fontSize: '0.9rem'}}>
                      掌握度：<span style={{color:'#1890ff',marginRight:'1rem'}}>{holdrate}%</span>
                    </div>
                  </Item>
                )
              })
            }
          </List>
      </Modal>
      <WhiteSpace style={{backgroundColor:"#f5f5f5"}}/>
      <div>
        <List>
          <Item arrow="horizontal" 
            onClick={e => this.props.router.push("/mobile-zq/mytest/")} 
            extra='做题历史'
          >
            待完成作业
          </Item>
          {not_finish_item}
        </List>
      </div>

    </div>
    
    );
  }
}

export default connect(state => {
  
  const student_data = state.studentData.toJS();
  console.log(state.AuthData.toJS());
  const {isFetching, poorkp, my_uncompleted_test} = student_data;
  return {
    my_uncompleted_test: my_uncompleted_test, 
    isFetching: isFetching,
    poorkp : poorkp,
    student_id: state.AuthData.get('userid'),
  }
}, action)(MyTest);