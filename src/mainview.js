import React, { Component, PropTypes } from 'react';
import { NavigatorIOS, Text, View, TouchableHighlight } from 'react-native';

import DashboardsList from './dashboardlist.js'

export default class NavigatorIOSApp extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: DashboardsList,
          title: 'My Initial Scene',
        }}
        style={{flex: 1}}
      />
    );
  }
}

