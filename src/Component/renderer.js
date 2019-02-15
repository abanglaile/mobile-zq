import React from 'react';
import ReactDOM from 'react-dom';
import katex from 'katex';

export default class Tex extends React.Component {
  constructor(props) { 
    super(props);
    console.log(props.content);
    this.state = {content: props.content};
    this.onChange = this.onChange.bind(this);
  }

  onChange(val){
    // console.log(val);
  }

  componentWillReceiveProps(nextProps) {
    var {content} = nextProps;
    this.setState({content});
  }

  render() { 
    var { content } = this.state;
    var htmlContent = content.replace(/(\$.*?\$)/g, function(word){
        //去掉首尾两个@
        word = word.substring(1, word.length - 1);
        console.log("word:",word);
        return katex.renderToString(word);
      }
    );   
    return (
      <div dangerouslySetInnerHTML={{__html: htmlContent}} />
      );
  }
}
var content = "题目：@c = \\pm\\sqrt{a^2 + b^2}@，请问答案是多少？";
ReactDOM.render(<Tex content = {content} />, document.getElementById('root'));