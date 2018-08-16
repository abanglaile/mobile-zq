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
        <Route path="root" component={App}>
          <IndexRoute component={practice} />
          <Route path="practice" component={practice} /> 
          <Route path="my_book_chapter" component={MyChapter} />
          <Route path="percenter" component={perCenter} />
          <Route path="lesson" component={lessonDetail} />
        </Route>
        <Route path="login" component={login} />
        
        <Route path="mytest" component={MyTest} />
        <Route path="question/:test_id" component={Question} />
        <Route path="studentstatus/:course_id" component={StudentStatus} />
        <Route path="student_kp/:kpid" component={StudentKp} />
        <Route path="kp_test_result/:test_id" component={KpTestResult} />
        <Route path="test_result/:test_id" component={TestResult} />
        <Route path="invite" component={Invite} />

        <Route path="chapter_kp/:chapter_id" component={ChapterKp} />
    </Route>
);
