import React from 'react';
import ReactDOM from 'react-dom';  
import { Button, Flex, WingBlank, ActivityIndicator } from 'antd-mobile';
var title = '若函数@f(x) = \\sqrt{mx^2 + mx + 1}@的定义域为R，则实数m的取值范围是?';
var answers = [
      { correct: 0, value: '@0 < m < 4@' },
      { correct: 1, value: '@0 \\leq m \\leq 4@' },
      { correct: 0, value: '@m \\geq 4@' },
      { correct: 0, value: '@0 < m \\leq 4@'}
    ];
var breakdown = [
      { sn: 0, value: 'f(x)定义域为R,则@mx^2 + mx + 1 \\geq 0@恒成立', kpid: '' },
      { sn: 1, value: '当@m \\neq 0@, @y = mx^2 + mx + 1@为二次函数，函数图像开口向上，与x轴最多只有一个交点。即@\\Delta = m^2 -4m \\leq 0@, m > 0', kpid: '' },
      { sn: 2, value: '解得：@0 < m \\leq 4@', kpid: '' },
      { sn: 3, value: '当m = 0，f(x) = 1，符合题意。综上所述@0 \\leq m \\leq 4@', kpid: '' },
    ];

var problems = { title: title, answers: answers, type: 1, breakdown: breakdown };

var title1 = '已知函数f(x)满足@2f(x) + 3f(-x) = 3x + 4@，则f(x)=';
var breakdown1 = [{sn: 0, value: '因为2f(x) + 3f(-x) = 3x + 4 (1)，则有2f(-x) + 3f(x) = -3x + 4 (2)，联立(1)(2)解得：@f(x) = 3x + 4/3@'}];
var answers1 = {value:'@3x + \\frac{4}/{3}@'};
var problem1 = { title: title1, type: 2, answers: answers1, breakdown: breakdown1 };
class Welcome extends React.Component {
  constructor(props, context) { 
      super(props,context);
      console.log(context);
      this.state = {isLoading: false};
  }
  isLoading(){
      console.log("set isLoading = true");
      this.setState({isLoading: true}); 
  }
  loadTestData(){
      this.setState({isLoading: false});
  }
  onStart(e){
      this.isLoading();
      setTimeout(() => {
        this.setState({isLoading: false});
        var history = this.context.router.history;
        var exercise = [problems, problem1];
        var state = { exindex: 0, exercise: exercise };
        history.push("/mobile-zq/Question", state);
      }, 5000);
  }
  render(){
    return (
      <WingBlank>
        <ActivityIndicator toast animating={this.state.isLoading} />
        <div style={{ margin: '8rem 0 0 0'}} className="btn-container">
          <div>
            <Button className="btn" type="ghost" onClick={e => this.onStart(e)}>开始测试</Button>
          </div>
        </div>
      </WingBlank>
    )  
  }
}
export default Welcome;
//ReactDOM.render(<Welcome />, document.getElementById('root'));

