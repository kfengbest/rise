import React, { Component, PropTypes } from 'react';
import { Navigator,NavigatorIOS, Text, View, TouchableHighlight } from 'react-native';

//import HomeView from './homeview.js'
var DashboardsList = require('./dashboardlist');

var QuestionsList1 = require('./QuestionsList1');
var QuestionsCell = require('./QuestionsCell');


var MainView = React.createClass({

  router(route, nav){
    switch(route.id){
      case 'dashboard':
        return (
          <QuestionsList1 />
        );       
      default:
        return (<View />);
    }
  },

  render(){
    return (
      <Navigator 
        initialRoute={{id:'dashboard'}}
        renderScene={this.router}
      />
    );
  },
});

module.exports = MainView;
