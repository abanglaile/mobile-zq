import React from 'react';
import ReactDOM from 'react-dom';
import {List,NavBar,Icon,ActivityIndicator,Menu} from 'antd-mobile';
import Tex from './renderer.js'

import *as action from '../Action/';
import {connect} from 'react-redux';

const data = [
  {
    value: '0',
    label: 'Food',
  }, {
    value: '1',
    label: 'Supermarket',
  },
  {
    value: '2',
    label: 'Extra',
    isLeaf: true,
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
    this.props.getBookChapter(student_id, course_id);
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

  render(){
    const { m_index, show } = this.state;
    const {book} = this.props;
    if(book.length > 1){
      var initData = book.map((bookitem,i) => (
         {"value":i,"lable":bookitem.bookname}
      ));
      var listDom = book[m_index].chapters.map((chapteritem, i) => (
          <List.Item arrow="horizontal" onClick={e => this.props.router.push("/mobile-zq/my_chapter_kp/"+ chapteritem.chapterid)}>
            {chapteritem.chaptername}
          </List.Item>
      ));
    }else{
      var initData = "";
    }

    console.log('book:'+JSON.stringify(book));
    console.log('initData:'+JSON.stringify(initData));
    
    const menuEl = (
      <Menu
        // className="single-foo-menu"
        data={initData}
        value={['0']}
        level={1}
        onChange={(value) => this.onChangeMenu(value)}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    const loadingEl = (
      <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    );

    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <div>
          <NavBar
              mode="light"
              rightContent={<div onClick={(e) => this.handleClick(e)} >基本乐理<Icon type="down" /></div>}
            >学习情况</NavBar>
        </div>
        {show ? initData ? menuEl : loadingEl : null}
        {show ? <div onClick={ () => this.onMaskClick() } /> : null}
        {listDom}
      </div>
    );
  }
}


export default connect((state, ownProps) => {
  const studentData = state.studentData.toJS();
  const {book, course_id} = studentData;
  return {
    book: book,
    course_id: 3,
    student_id: state.AuthData.get('userid'),
  };
}, action)(MyChapter);
