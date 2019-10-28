import React from 'react';
// import Question from 'bundle-loader?lazy&name=Question!../Component/Question.js'
import Question from '../Component/Question.js'
import TestResult from '../Component/TestResult.js'
import KpTestResult from '../Component/KpTestResult.js'
import practice from '../Component/practice.js'
import MyTest from '../Component/my_test.js'
import MyChapter from '../Component/MyChapter.js'

import ChapterKp from '../Component/chapter_kp.js'

import login from '../Component/login.js'
import StudentStatus from '../Component/StudentStatus.js'
import StudentKp from '../Component/StudentKp.js'
import Invite from '../Component/invite.js'
import perCenter from '../Component/me.js'
import Name from '../Component/name.js'
import Group from '../Component/group.js'

import lessonDetail from '../Component/lessonDetail.js'
import { Route, IndexRoute } from 'react-router';
import { requireAuthentication } from '../utils';

import App  from '../Component/index.js';

const isReactComponent = (obj) => Boolean(obj && obj.prototype && Boolean(obj.prototype.isReactComponent));

const component = (component) => {
  return isReactComponent(component)
    ? {component}
    : {getComponent: (loc, cb)=> component(
         comp=> cb(null, comp.default || comp))}
};
//独立编译
//        <Route path="Question" {...component(Question)} />

export default (
  	<Route path="mobile-zq">
        <Route path="root" component={requireAuthentication(App)}>
         {/* <Route path="root" component={App}>  */}
          <IndexRoute component={practice} />
          <Route path="practice" component={practice} /> 
          <Route path="my_book_chapter" component={MyChapter} />
          <Route path="percenter" component={perCenter} />
          <Route path="lesson" component={lessonDetail} />
        </Route>
        <Route path="login" component={login} />
        
        <Route path="mytest" component={requireAuthentication(MyTest)} />
        <Route path="question/:test_id" component={requireAuthentication(Question)} />
        {/* <Route path="question/:test_id" component={Question} /> */}
        <Route path="studentstatus/:course_id" component={requireAuthentication(StudentStatus)} />
        <Route path="student_kp/:kpid" component={requireAuthentication(StudentKp)} />
        <Route path="kp_test_result/:test_id" component={requireAuthentication(KpTestResult)} />
        <Route path="test_result/:test_id" component={requireAuthentication(TestResult)} />
        <Route path="invite" component={requireAuthentication(Invite)} />
        <Route path="chapter_kp/:chapter_id" component={requireAuthentication(ChapterKp)} />
        <Route path="name" component={requireAuthentication(Name)} />
        <Route path="group" component={requireAuthentication(Group)} />
    </Route>
);
