import React from 'react';
import ReactDOM from 'react-dom';
import {List,NavBar,Icon,ActivityIndicator,Menu,WhiteSpace,Modal} from 'antd-mobile';
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
    };
  }

  componentDidMount(){
    const {student_id, course_id} = this.props;
    this.props.setSelectedTab("redTab");
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

  getKpByChapterid(chapterid){
    console.log("chapterid:"+chapterid);
    this.props.getChapterKpStatus(this.props.student_id, chapterid);
    this.setState({modal: true});
  }

  renderChapterList(){
    const {book,student_id} = this.props;
    const { m_index} = this.state;

    if(book.length > 0){
      return (
        <List>
          {
            book[m_index].chapters.map((chapteritem) => {
              return (
                <div>
                  <Item 
                    extra={'开始练习'}
                    thumb={<Circle width={50} type="circle" percent={chapteritem.chapterrate} format={(percent) => `${percent}%`}/>} 
                    onClick={() => this.getKpByChapterid(chapteritem.chapterid)}
                  >
                    <div style={{display: 'flex', marginTop: '1.5rem',marginBottom: '1.5rem', alignItems: 'center'}}>
                      {chapteritem.chaptername}
                    </div>
                  </Item>
                  <WhiteSpace style={{backgroundColor:"#f5f5f5"}}/>
                </div>
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
    const {book,student_rating,chapter} = this.props;
    const {kp} = chapter
    var initData = [];
    if(book.length > 0){
      for(var i=0;i<book.length;i++){
        initData.push({"value":i.toString(),"label":book[i].bookname});
      }
    }
    console.log('book:'+JSON.stringify(book));
    console.log('student_rating:'+JSON.stringify(student_rating));

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
            style = {{position:'relative',color: '#FFF' ,backgroundColor: '#1890ff',zIndex: '90'}}
            mode="dark"
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
        {this.renderChapterList()}

        <Modal
          title='相关知识点'
          transparent
          visible={this.state.modal}
          onClose
          footer={[{ text: '确定', onPress: () => { this.setState({modal: false})} }]}
        >
          <div style={{ height: 400, overflow: 'scroll' }}>
            <List>
            {
              kp.map((item) => {
                var correct_rate = item.practice ? Math.round((item.correct/item.practice)*100) : 0;
                return (
                  <Item 
                    arrow="horizontal"
                    multipleLine
                    onClick={e => this.props.router.push("/mobile-zq/student_kp/"+item.kpid)}
                  > 
                      {item.kpname}
                      <Brief>
                        <div>
                          <span>正确率： </span>
                          <span style={{color: '#1890ff', fontSize: '1.2rem'}}>{correct_rate}%</span>
                        </div>
                      </Brief>
                  </Item>
                )
              })
            }
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}


export default connect((state, ownProps) => {
  const studentData = state.studentData.toJS();
  const {book, course_id,student_rating,chapter} = studentData;
  return {
    book: book,
    course_id: 3,
    student_rating : student_rating,
    chapter: chapter ? chapter : [],
    student_id: state.AuthData.get('userid'),
  };
}, action)(MyChapter);
