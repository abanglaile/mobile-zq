import React from 'react';
import ReactDOM from 'react-dom';
import { TabBar } from 'antd-mobile';

import *as action from '../Action/';
import {connect} from 'react-redux';

const project_address = "/mobile-zq";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.tab ? this.props.tab : 'blueTab',
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.tab != this.props.tab){
      this.setState({selectedTab : nextProps.tab});
    }
  }


  render() {

    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          <TabBar.Item
            title="提分"
            key="upscore"
            icon={<div style={{
              width: '25px',
              height: '25px',
              background: 'url(' + project_address + '/img/tarbar_icon/up.png) center center /  21px 21px no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '25px',
              height: '25px',
              background: 'url(' + project_address + '/img/tarbar_icon_selected/up.png) center center /  21px 21px no-repeat' }}
            />
            }
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
              this.props.setSelectedTab("blueTab");
              this.props.router.push("/mobile-zq/root/practice");
            }}
            data-seed="logId"
          >
            {this.props.children}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon/record.png) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon_selected/record.png) center center /  21px 21px no-repeat' }}
              />
            }
            title="学情"
            key="xueqing"
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
              this.props.setSelectedTab("redTab");
              this.props.router.push("/mobile-zq/root/my_book_chapter");
            }}
            data-seed="logId1"
          >
            {this.props.children}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon/course.png) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon_selected/course.png) center center /  21px 21px no-repeat' }}
              />
            }
            title="课程"
            key="course"
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
              });
              this.props.setSelectedTab("greenTab");
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon/my.png) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '25px',
                height: '25px',
                background: 'url(' + project_address + '/img/tarbar_icon_selected/my.png) center center /  21px 21px no-repeat' }}
              />
            }
            title="我"
            key="my"
            selected={this.state.selectedTab === 'yellowTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'yellowTab',
              });
              this.props.setSelectedTab("yellowTab");
              this.props.router.push("/mobile-zq/root/percenter");
            }}
          >
            {this.props.children}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default connect(state => {
  const student_state = state.studentData.toJS();
  return {
    isFetching: student_state.isFetching,
    tab: student_state.tab,
  }
}, action)(App);