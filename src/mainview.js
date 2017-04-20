import React, { Component, PropTypes } from 'react';
import { Navigator,NavigatorIOS, Text, View, TouchableHighlight } from 'react-native';

//import HomeView from './homeview.js'
var HomeView = require('./homeview');

var QuestionsList1 = require('./QuestionsList1');


var MainView = React.createClass({

  router(route, nav){
    switch(route.id){
      case 'dashboard':
        return (
          <HomeView />
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
