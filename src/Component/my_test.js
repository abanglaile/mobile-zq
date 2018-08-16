import { Tabs, WhiteSpace, List, Icon, Button, NavBar, ActivityIndicator } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';

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
    console.log(this.props);
    this.props.updateEntry("mytest");
  }

  componentDidMount(){
    this.loadTest();
  }

  loadTest(){
    // var student_id = '17';
    // this.props.getMyHistoryTests(student_id);
    this.props.getHistoryTest(this.props.student_id);
  }

  render() {
    console.log("this.props.test_tab:"+this.props.test_tab);
    var {isFetching, my_test_list} = this.props;
    var teacher_test = [], auto_test = [];
    if(my_test_list){
      for(var i = 0; i < my_test_list.length; i++){
        if(my_test_list[i].test_type == 1){
          teacher_test.push(my_test_list[i]);
        }else{
          auto_test.push(my_test_list[i]);
        }
      }
    }

    var auto_test_item = auto_test.map((item,i) => {
        var time = item.enable_time;
        return(
          <Item arrow="horizontal" multipleLine extra={item.finish_time ? '测试报告' : '开始练习'} onClick={e => {
            this.props.updateEntry("mytest");
            this.props.router.push("/mobile-zq/test_result/"+ item.test_id);
            }
          }>
            {item.test_name}
            <Brief>
              <span style={{paddingRight : "1rem",borderRight:"1px solid "}}>
                正确率：{item.correct_exercise}/{item.total_exercise}
              </span>
              <span style={{paddingLeft : "1rem"}}>
                {item.formatdate}
              </span>
            </Brief> 
          </Item>
      );
    });
    var teacher_test_item = teacher_test.map((item,i) => {

        var time = item.enable_time;
        return(
          <Item arrow="horizontal" multipleLine extra={item.finish_time ? '测试报告' : '开始练习'} onClick={e => this.props.router.push("/mobile-zq/test_result/"+ item.test_id)}>
            {item.test_name}
            <Brief>
              <span style={{paddingRight : "1rem",borderRight:"1px solid "}}>
                正确率：{item.correct_exercise}/{item.total_exercise}
              </span>
              <span style={{paddingLeft : "1rem"}}>
                {item.formatdate}
              </span>
            </Brief>  
          </Item>
      );
    });
    const tabs = [
      { title: '老师布置'},
      { title: '自主练习'},
    ];
    return (
    <div>
      <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={e => {
            this.props.setMyTestTab(0);
            this.props.router.push("/mobile-zq/root")}
          }
        >做题历史</NavBar>
      <ActivityIndicator toast animating={this.props.isFetching} />
      <Tabs tabs={tabs}
         // initialPage={0}
         onTabClick= {(tab,index) => this.props.setMyTestTab(index)}
         initialPage={this.props.test_tab ?  this.props.test_tab : 0}
         >
        <div>
          <List className="my-list">
            {teacher_test_item}
          </List>
        </div> 
        <div>
        	<List className="my-list">
          	{auto_test_item}
        	</List>
        </div> 
      </Tabs>
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
    test_tab: student_state.test_tab,
    student_id: state.AuthData.get('userid'), 
  }
}, action)(MyTest);