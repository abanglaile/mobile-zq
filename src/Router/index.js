import React from 'react';
// import Question from 'bundle-loader?lazy&name=Question!../Component/Question.js'
import Question from '../Component/Question.js'
import AnswerSheet from '../Component/AnswerSheet.js'
import TestStatus from '../Component/TestStatus.js'
import TestResult from '../Component/TestResult.js'
import KpTestResult from '../Component/KpTestResult.js'
import practice from '../Component/practice.js'
import MyTest from '../Component/my_test.js'
import MyChapter from '../Component/MyChapter.js'
import my_chapter_kp from '../Component/my_chapter_kp.js'
import login from '../Component/login.js'
import StudentStatus from '../Component/StudentStatus.js'
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
  	<Route path="mobile-zq" component={App}>
        <IndexRoute component={practice} />
        <Route path="practice" component={practice} />
        <Route path="my_book_chapter" component={my_book_chapter} />
      	<Route path="login" component={login} />
      	<Route path="my_book_chapter" component={MyChapter} />
        <Route path="my_chapter_kp/:chapter_id" component={my_chapter_kp} />
        <Route path="mytest" component={MyTest} />
        <Route path="Question" component={Question} />
        <Route path="studentstatus" component={StudentStatus} />

        <Route path="AnswerSheet" component={AnswerSheet} />
        <Route path="TestStatus/:test_id" component={TestStatus} />
        <Route path="kpTestResult" component={KpTestResult} />
        <Route path="testResult/:test_id" component={TestResult} />
    </Route>
);
