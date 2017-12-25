import { Tabs, WhiteSpace, List, Badge, Button, ActivityIndicator } from 'antd-mobile';
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
    alert(window.innerWidth);
  }

  componentDidMount(){
    this.loadTest();
  }

  loadTest(){
    // var student_id = '1';
    this.props.getMyTestList(this.props.student_id);
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
    const tabs = [
      { title: '未完成'},
      { title: '完成'},
    ];
    return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff', fontSize: '1rem' }}>
          我的任务
      </div>
      <ActivityIndicator toast animating={this.props.isFetching} />
      <Tabs tabs={tabs}
         initialPage={0}>
        <div>
          <List className="my-list">
            {not_finish_item}
          </List>
        </div> 
        <div>
        	<List className="my-list">
          	{finish_item}
        	</List>
        </div> 
      </Tabs>
        
      <WhiteSpace />

    </div>
    
    );
  }
}

export default connect(state => {
  console.log(state);
  const student_state = state.studentData.toJS();
  return {
    my_test_list: student_state.my_test_list, 
    isFetching: student_state.isFetching,
    student_id: state.AuthData.get('userid'), 
  }
}, action)(MyTest);