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
    this.props.getMyChapter(student_id, course_id);
  }

  render() {
    const {book} = this.props;
    const accordion = book.map((bookitem,i) => (
              <Accordion.Panel header={bookitem.bookname}>
                <List>
                  {
                    bookitem.chapters.map((chapteritem, i) => (
                      <List.Item onClick={e => this.props.router.push("/mobile-test/mychapterkp")}>{chapteritem}</List.Item>
                    ))
                  }
                </List>
              </Accordion.Panel>
            ));
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Accordion defaultActiveKey="0" onChange={this.onChange}>
          {accordion}
          <Accordion.Panel header="高中数学必修一">
            <List className="my-list">
              <List.Item>集合与函数</List.Item>
              <List.Item>初等函数</List.Item>
              <List.Item>函数的零点</List.Item>
            </List>
          </Accordion.Panel>
          <Accordion.Panel header="Title 2" className="pad">this is panel content2 or other</Accordion.Panel>
          <Accordion.Panel header="Title 3" className="pad">
            Text text text text text text text text text text text text text text text
          </Accordion.Panel>
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