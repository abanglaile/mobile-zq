import React from 'react';
// import Question from 'bundle-loader?lazy&name=Question!../Component/Question.js'
import Question from '../Component/Question.js'
import AnswerSheet from '../Component/AnswerSheet.js'
import TestStatus from '../Component/TestStatus.js'
import TestResult from '../Component/TestResult.js'
import KpTestResult from '../Component/KpTestResult.js'
import MyTest from '../Component/my_test.js'
import MyChapter from '../Component/MyChapter.js'
import login from '../Component/login.js'
import { Route, IndexRoute } from 'react-router';
import { requireAuthentication } from '../utils';

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
  	<Route path="/">
      <Route path="mobile-test">
      	<Route path="login" component={login} />
      	<Route path="mychapter" component={MyChapter} />
        <Route path="mytest" component={MyTest} />
        <Route path="Question" component={Question} />

        <Route path="AnswerSheet" component={AnswerSheet} />
        <Route path="TestStatus/:test_id" component={TestStatus} />
        <Route path="kpTestResult" component={KpTestResult} />
        <Route path="testResult/:test_id" component={TestResult} />
      </Route>
    </Route>
);
