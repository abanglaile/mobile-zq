import React from 'react';
import ReactDOM from 'react-dom';
import {List,NavBar,Icon,ActivityIndicator,Menu,Result,WhiteSpace} from 'antd-mobile';
import Tex from './renderer.js'
import { Progress as Circle} from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';


const Item = List.Item;
const data = [
  {
    value: '0',
    label: '基本乐理',
  }, 
];

class MyChapter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      m_index: 0,
    };
  }

  componentDidMount(){
    const {student_id, course_id} = this.props;
    this.props.getMyLadderScore(student_id);
    this.props.getMyBookChapter(student_id, course_id);
  }

  onChangeMenu(value){
    this.setState({
      m_index: value,
    });
    // console.log('value:'+JSON.stringify(value));
    // console.log('value:'+value);
    // let label = '';
    
    // console.log(label);
  }

  handleClick(e){
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show,
    });
    // mock for async data loading
    // if (!this.state.initData) {
    //   setTimeout(() => {
    //     this.setState({
    //       initData: data,
    //     });
    //   }, 500);
    // }
  }

  onMaskClick(){
    this.setState({
      show: false,
    });
  }

  renderChapterList(){
    const {book} = this.props;
    const { m_index} = this.state;

    if(book.length > 0){
      return (
        <List>
          {
            book[m_index].chapters.map((chapteritem) => {
              return (
                <Item 
                  extra={'开始练习'}
                  thumb={<Circle width={50} type="circle" percent={chapteritem.chapterrate} />} 
                  onClick={e => this.props.router.push("/mobile-zq/my_chapter_kp/"+ chapteritem.chapterid)}
                >
                  <div style={{display: 'flex', marginTop: '1.5rem',marginBottom: '1.5rem', alignItems: 'center'}}>
                    {chapteritem.chaptername}
                  </div>
                </Item>
              )
            })
          }
        </List>
      );
    }else{
      return;
    }
    
  }

  render(){
    const { show } = this.state;
    const {book,ladderscore} = this.props;
    var initData = [];
    if(book.length > 0){
      for(var i=0;i<book.length;i++){
        initData.push({"value":i.toString(),"label":book[i].bookname});
      }
    }
    console.log('book:'+JSON.stringify(book));
    console.log('ladderscore:'+JSON.stringify(ladderscore));

    const menuEl = (
      <Menu
        style = {{position:'absolute',zIndex: '90' ,width: '100%'}}
        data={initData}
        value={['0']}
        level={1}
        onChange={(value) => this.onChangeMenu(value)}
        height={document.documentElement.clientHeight * 0.3}
      />
    );

    const loadingEl = (
      <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    );

    return (
      <div>
        <div>
          <NavBar
            style = {{position:'relative',color: '#FFF' ,backgroundColor: '#5cdbd3',zIndex: '90'}}
            mode="light"
            rightContent={<div onClick={(e) => this.handleClick(e)} >基本乐理<Icon type={show ? "up" : "down"} /></div>}
          >
            学习情况
          </NavBar>
        </div>
        {show ? initData ? menuEl : loadingEl : null}
        {
          show ? 
          <div 
            style = {{position:'absolute',zIndex: '89' ,width: '100%', height: '100%',backgroundColor: '#000',opacity:'0.4',top:0}} 
            onClick={ () => this.onMaskClick() } 
          /> : null
        }
        <WhiteSpace size='lg' />
        <List >
          <Item 
            arrow="horizontal" 
            extra={'查看我的能力'}
            onClick={e => this.props.router.push("/mobile-zq/studentstatus")}
          >
            <div style={{display: 'flex', marginTop: '1.2rem',marginBottom: '1.2rem', alignItems: 'center'}}>
              总天梯分:<div style={{margin:'0 0 0.2rem 0.5rem',fontWeight: 'bold',fontSize: '1.5rem'}}>{ladderscore}</div>
            </div>
          </Item>
        </List>
        <WhiteSpace size='lg' />
        {this.renderChapterList()}
      </div>
    );
  }
}


export default connect((state, ownProps) => {
  const studentData = state.studentData.toJS();
  const {book, course_id,ladderscore} = studentData;
  return {
    book: book,
    course_id: 3,
    ladderscore : ladderscore,
    student_id: state.AuthData.get('userid'),
  };
}, action)(MyChapter);
