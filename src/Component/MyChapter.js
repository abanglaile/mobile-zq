import React from 'react';
import ReactDOM from 'react-dom';
import {List, Accordion} from 'antd-mobile';
import Tex from './renderer.js'

import *as action from '../Action/';
import {connect} from 'react-redux';


class MyChapter extends React.Component {
  onChange = (key) => {
    console.log(key);
  }

  componentDidMount(){
    const {student_id, course_id} = this.props;
    this.props.getBookChapter(student_id, course_id);
  }

  render() {
    const {book} = this.props;
    console.log('book:'+JSON.stringify(book));
    const accordion = book.map((bookitem,i) => (
              <Accordion.Panel header={bookitem.bookname}>
                <List>
                  {
                    bookitem.chapters.map((chapteritem, i) => (
                      <List.Item onClick={e => this.props.router.push("/mobile-zq/my_chapter_kp/"+ chapteritem.chapterid)}>{chapteritem.chaptername}</List.Item>
                    ))
                  }
                </List>
              </Accordion.Panel>
            ));
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Accordion defaultActiveKey="0" onChange={this.onChange}>
          {accordion}
        </Accordion>
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