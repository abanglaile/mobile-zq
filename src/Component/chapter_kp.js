import React from 'react';
import ReactDOM from 'react-dom';
import {List,NavBar,Icon,ActivityIndicator,Menu,WhiteSpace,Modal, Flex, Progress} from 'antd-mobile';
// import Tex from './renderer.js'
//import { Progress as Circle} from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';


class ChapterKp extends React.Component {

  componentDidMount(){
    const {student_id, params} = this.props;
    const chapter_id = params.chapter_id;
    console.log(chapter_id);
    if(chapter_id){
      this.props.getChapterKpStatus(student_id, chapter_id);
      //this.props.getChapterStatus(student_id, chapter_id);  
    }
  }

  renderKpList(){
    const {chapter} = this.props;
    const {kp_status} = chapter;
    
    return kp_status.map((item) => {
        return(
          <List
              renderHeader={() => {
                const random = Math.random() * 100;

                return( 
                <div style={{marginLeft: '0.5rem', marginBottom: '0,5rem', width: '70%'}}>
                  <div style={{fontWeight: 'bold', color: "black", fontSize: '1rem'}}>{item.kpname}</div>
                  <div style={{marginTop:'0.4rem',fontSize: '0.9rem'}}>
                    掌握度：<span style={{color:'#1890ff',marginRight:'2rem'}}>{random.toFixed(1)}%</span>
                    能力值：<span style={{color:'#1890ff'}}>{random.toFixed(0)}</span>
                  </div>
                  <div style={{width: '70%', marginTop: "0.5rem"}}>
                    
                  </div>  
                </div>
                )
              }}
            >
                <List.Item 
                  // thumb="../../img/item_icon/pen.png"
                  thumb={<div style={{
                    marginLeft:'0.5rem',
                    width: '20px',
                    height: '20px',
                    background: 'url(../../img/item_icon/pen.png) center center /  17px 17px no-repeat' }}
                    />
                  }
                  style={{backgroundColor: '#f5f5f5'}}
                >
                  <span style={{fontSize: "1rem"}}>开始修炼</span>
                </List.Item>
                <List.Item 
                  // thumb="../../img/item_icon/video2.png"
                  thumb={<div style={{
                    marginLeft:'0.5rem',
                    width: '20px',
                    height: '20px',
                    background: 'url(../../img/item_icon/video2.png) center center /  17px 17px no-repeat' }}
                    />
                  }
                  style={{backgroundColor: '#f5f5f5'}}
                >
                  <span style={{fontSize: "1rem"}}>视频</span>
                </List.Item>
          </List>
        )
      })      
  }
  
  // <Flex>
  //                     <Flex.Item><div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '0.7rem',
  //                           }} >总次数</div>
  //                           <div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '1rem',
  //                             color: 'black',
  //                           }}>{item.practice}</div>
  //                     </Flex.Item>
  //                     <Flex.Item><div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '0.7rem',
  //                           }} >正确率</div>
  //                           <div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '1rem',
  //                             color: 'black',
  //                           }}>45%</div>
  //                     </Flex.Item>
  //                     <Flex.Item><div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '0.7rem',
  //                           }} >战力</div>
  //                           <div style={{
  //                             height: '1rem',
  //                             lineHeight: '1rem',
  //                             width: '3rem',
  //                             fontSize: '1rem',
  //                             color: 'black',
  //                           }}>{item.kp_rating}</div>
  //                     </Flex.Item>
  //                   </Flex>


  render(){
    const {chapter} = this.props;
    const random = Math.random() * 100;
    console.log(chapter.chapter_status);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.router.push("/mobile-zq/root/my_book_chapter")}
        ></NavBar>
        <div style={{marginLeft: '1.5rem', marginBottom: '1.5rem', width: '70%'}}>
          <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{chapter.chapter_status.chaptername}</div>
          <div style={{fontSize: '1.2rem',marginTop: '0.5rem', color: '#888'}}>
            掌握度：<span style={{color:'#1890ff'}}>{random.toFixed(1)}%</span>
          </div>                 
          <div style={{marginTop: '1rem', padding: '1rem 1rem 1rem 1rem', backgroundColor: "#f5f5f5"}}>
            <Flex>
              <Flex.Item><div style={{
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      color: '#888',
                      fontSize: '0.7rem',
                    }} >总次数</div>
                    <div style={{
                      marginTop:'0.3rem',
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      fontSize: '1rem',
                      color: '#1890ff',
                    }}>15</div>
              </Flex.Item>
              <Flex.Item><div style={{
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      color: '#888',
                      fontSize: '0.7rem',
                    }} >正确率</div>
                    <div style={{
                      marginTop:'0.3rem',
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      fontSize: '1rem',
                      color: '#1890ff',
                    }}>45%</div>
              </Flex.Item>
              <Flex.Item><div style={{
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      color: '#888',
                      fontSize: '0.7rem',
                    }} >已达标</div>
                    <div style={{
                      marginTop:'0.3rem',
                      height: '1.5rem',
                      lineHeight: '1.5rem',
                      width: '3rem',
                      fontSize: '1rem',
                      color: '#1890ff',
                    }}>6/10</div>
              </Flex.Item>
            </Flex>
          </div>
        </div>
        <WhiteSpace style={{backgroundColor:"#f5f5f5"}} />
        {this.renderKpList()}  
      </div>
    );
  }
}


export default connect((state, ownProps) => {
  const studentData = state.studentData.toJS();
  const {student_rating,chapter,isFetching} = studentData;
  return {
    isFetching: isFetching,
    student_rating : student_rating,
    chapter: chapter ? chapter : [],
    student_id: state.AuthData.get('userid'),
  };
}, action)(ChapterKp);
