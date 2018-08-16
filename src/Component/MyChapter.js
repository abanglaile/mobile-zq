import React from 'react';
import ReactDOM from 'react-dom';
import {List,NavBar,Icon,ActivityIndicator,Menu,WhiteSpace,Modal, Tabs} from 'antd-mobile';
// import Tex from './renderer.js'
import { Progress as Circle} from 'antd';

import *as action from '../Action/';
import {connect} from 'react-redux';


const Item = List.Item;
const Brief = Item.Brief;
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
      modal: false,
      m_index: 0,
      tab_index: 0,
    };
  }

  componentDidMount(){
    const {student_id, course_id} = this.props;
    this.props.setSelectedTab("redTab");
    console.log("set redTab");
    console.log("student_id, course_id :",student_id,course_id);
    this.props.getMyStudentRating(student_id, course_id);
    this.props.getMyBookChapter(student_id, course_id);
  }

  onChangeMenu(value){
    this.setState({
      m_index: value,
    });
    console.log(value);
    
  }

  onChangeTabs(index){
    this.setState({
      tab_index: index,
    })
    // const {student_id} = this.props;
    // console.log("tab", tab);
    // this.props.getMyBookChapter(student_id, tab.bookid);
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

  getKpByChapterid(chapter_id){
    this.props.router.push("/mobile-zq/chapter_kp/" + chapter_id);
  }

  renderChapterList(){
    const {books, student_id} = this.props;
    const {tab_index} = this.state;

    if(books.length > 0){
      return (
        <List>
          {
            books[tab_index].chapters.map((item) => {
              let chapter_rate = (item.chapter_rating && item.chapter_standard) ? (item.chapter_rating * 100/item.chapter_standard).toFixed(1) : 0;
              return (
                <div>
                  <Item 
                    extra={'开始练习'}
                    thumb={<Circle width={50} type="circle" percent={chapter_rate} format={(percent) => `${percent}%`}/>} 
                    onClick={() => this.props.router.push("/mobile-zq/chapter_kp/" + item.chapterid)}
                  >
                    <div style={{display: 'flex', marginTop: '1.5rem',marginBottom: '1.5rem', alignItems: 'center'}}>
                      {item.chaptername}
                    </div>
                  </Item>

                </div>
              )
            })
          }
        </List>
      );
    }
    
  }

  render(){
    const { show } = this.state;
    const {books, student_rating,chapter,isFetching} = this.props;
    var initData = [];
    if(books.length > 0){
      for(var i=0;i<books.length;i++){
        initData.push({"value":i.toString(),"label":books[i].bookname});
      }
    }
    console.log(books[0]);

    let tabs = [];
    for(var i = 0; i < books.length; i++){
      tabs[i] = { title: books[i].bookname, bookid: books[i].bookid};
    }
    console.log(tabs);

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

    if(isFetching){  
        return (<ActivityIndicator toast animating={isFetching} /> );  
    }

    return (
      <div>
        <div>
          <NavBar
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
        <div style = {{padding:"1.2rem 1rem"}}>
          <List >
            <Item 
              arrow="horizontal" 
              extra={'查看我的能力'}
              onClick={e => this.props.router.push("/mobile-zq/studentstatus")}
              style = {{border:"1px solid #1890ff",borderRadius: "5px",overflow:"hidden"}}
            >
              <div 
                style={{display: 'flex', alignItems: 'center',margin:"0.5rem 0 0.5rem 0"}}
              >
                总天梯分:<div style={{margin:'0 0 0.2rem 0.5rem',fontWeight: 'bold',fontSize: '1.5rem',color:"#1890ff"}}>{student_rating}</div>
              </div>
            </Item>
          </List>
        </div>
        <WhiteSpace size='lg' style={{backgroundColor:"#f5f5f5"}}/>
        <Tabs tabs={tabs}
          initialPage={0}
          
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { this.onChangeTabs(index) }}
        >
          {this.renderChapterList()}

        </Tabs>

        

        
      </div>
    );
  }
}


export default connect((state, ownProps) => {
  const studentData = state.studentData.toJS();
  const {books, course, course_id, student_rating, chapter,isFetching} = studentData;
  return {
    books: books,
    course_id: course_id,
    course: course,
    isFetching: isFetching,
    student_rating : student_rating,
    student_id: state.AuthData.get('userid'),
  };
}, action)(MyChapter);
