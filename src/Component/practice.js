import { Tabs, WhiteSpace, List, Icon, Button, NavBar, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';

import *as action from '../Action/';
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
  }

  componentDidMount(){
    this.loadTest();
    this.props.updateEntry("root");
  }

  loadTest(){
    // var student_id = '1';
    this.props.getUncompletedTest(this.props.student_id);
  }

  render() {
    var {isFetching, my_uncompleted_test,student_id} = this.props;
    // var not_finish_test = [];
    // if(my_test_list){
    //   for(var i = 0; i < my_test_list.length; i++){
    //     if(!my_test_list[i].finish_time){
    //       not_finish_test.push(my_test_list[i]);
    //     }
    //   }
    // }
    var not_finish_item = my_uncompleted_test.map((item,i) => {
        var time = item.enable_time;
        return(
          <Item 
            arrow="horizontal" 
            multipleLine 
            extra='开始练习' 
            onClick={e => this.props.getTestData(student_id, item.test_id, item.test_type, {entry: "practice"})}
            style = {{border:"1px solid",bordeRadius: "5px"}}
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
    return (
    <div>
      <NavBar
          mode="light"
        >提分</NavBar>
      <ActivityIndicator toast animating={this.props.isFetching} /> 
      <div>
        <List>
          <Item arrow="horizontal" extra='设置'>提分计划</Item>
          <Item extra={<Button type='ghost' size='small' inline>继续</Button>} >
            薄弱知识点
            <Brief>已掌握0/4</Brief>
          </Item>
        </List>
      </div>
      <WhiteSpace />
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
  console.log(state);
  const student_state = state.studentData.toJS();
  return {
    my_uncompleted_test: student_state.my_uncompleted_test, 
    isFetching: student_state.isFetching,
    student_id: state.AuthData.get('userid'), 
  }
}, action)(MyTest);