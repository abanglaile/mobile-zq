import React from 'react';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { List, NavBar, Icon, Progress, WhiteSpace, ActivityIndicator, Button, Flex, Modal } from 'antd-mobile';
// import { Progress } from 'antd';

import Tex from './renderer.js';

const Item = List.Item;
const Brief = Item.Brief;
const operation = Modal.operation;

class my_chapter_kp extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const {student_id, params} = this.props;
    const chapter_id = params.chapter_id;
    if(chapter_id){
      this.props.getChapterName(chapter_id);
      this.props.getChapterStatus(student_id, chapter_id);
      this.props.getChapterKpStatus(student_id, chapter_id);
    }else{
      alert("页面参数错误");
    }
  }

  getChapterName(){
    var chaptername = "";
    const {book,params} = this.props;
    const chapter_id = params.chapter_id;
    console.log('book:'+JSON.stringify(book));
    book.map((itemb) => {
      console.log('itemb:'+JSON.stringify(itemb));
      itemb.chapters.map((itemc) =>{
        if(itemc.chapterid == chapter_id)
          chaptername = itemc.chaptername;
      })
    });
    return chaptername;
  }

  renderKpList(){
      const {chapter,student_id} = this.props;
      const {kp} = chapter;
      if(kp.length > 0){
      return(
          <div>
            <div>
              <List renderHeader={() => ''}>
                {
                  kp.map((item) => {
                    var correct_rate = item.practice ? item.correct/item.practice : 0;
                    return (
                      <Item multipleLine arrow="horizontal" onClick={() => operation([
                        { text: '知识点讲解', onPress: () => console.log('知识点讲解被点击了') },
                        { text: '能力详情', onPress: () => console.log('能力详情被点击了') },
                        { text: '继续修炼', onPress: () => this.props.getTestDataByKp(student_id,item.kpid,item.kpname) },
                      ])}>
                        {item.kpname}
                        <div style={{display: 'flex', marginTop: '0.5rem', alignItems: 'center'}}>
                          <Progress style={{width: '60%'}} percent={correct_rate} position="normal" />
                          <div style={{fontSize: '1rem', marginLeft: '1rem'}}>{correct_rate}%</div>
                        </div>
                        <Brief><div>练习{item.practice ? item.practice : 0}次</div></Brief>
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
    var {isFetching, chapter} = this.props;
    console.log("chapter:"+JSON.stringify(chapter));
    var {status, kp, chaptername} = chapter;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >我的知识点</NavBar>
        <div style={{
            textAlign: 'center',
            lineHeight:'8rem',
            height: '8rem',
            fontSize: '2rem',
            backgroundColor: '#5cdbd3',
            color: "white"
          }}>{chaptername}</div>
        <WhiteSpace size='lg' />
        <Flex>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{status.practice}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>练习次数</div>
          </Flex.Item>
          <Flex.Item><div style={{
                  textAlign: 'center',
                  height: '1.5rem',
                  lineHeight: '1.5rem',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }} >{status.practice ? status.correct/status.practice : 0}</div>
                <div style={{
                  textAlign: 'center',
                  height: '1.2rem',
                  lineHeight: '1.2rem',
                  width: '100%',
                  fontSize: '1rem'}}>正确率</div>
          </Flex.Item>
        </Flex>
        {this.renderKpList()}
      </div>
    );
  }
}

export default connect(state => {
  const studentData = state.studentData.toJS();
  const {isFetching, chapter, book} = studentData;
  console.log(studentData);
  return {
    chapter: chapter,
    book : book,
    isFetching: isFetching ? isFetching : false,
    student_id:state.AuthData.get('userid'),
  };
}, action)(my_chapter_kp);