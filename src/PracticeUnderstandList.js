'use strict';

import React, { Component, PropTypes } from 'react';
import { Navigator,
        NavigatorIOS, 
        Text, 
        View, 
        TouchableHighlight, 
        StyleSheet,
        AsyncStorage,
        Image,
        ListView,
        Platform,
        ActivityIndicatorIOS,
        ProgressBarAndroid,
        TouchableNativeFeedback,
        PixelRatio } from 'react-native';

var Subscribable = require('Subscribable');
var PracticeUnderstandCell = require('./PracticeUnderstandCell');
var PracticeUnderstandAnswerDetail = require('./PracticeUnderstandAnswerDetail');

var Gateway = require('./Gateway');
var Config = require('./Config');

import RNFetchBlob from 'react-native-fetch-blob'


var PracticeUnderstandList = React.createClass({

  mixins: [Subscribable.Mixin],

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false,
      noMore: false,
      cache: {offset: 0, items:[]}, 
      filterIndex : 0,
      filterTitle : '巩固练习'
    };
  },

  reloadData() {

    this.state.cache.items.push(...this.props.data);
    this.updateDataSourceHandler(this.state.cache.items, 0);

  },

  appendData() {
    console.log("listview appendData");
  },


  componentDidMount() {
    //this.addListenerOn(this.props.events, 'filterEvent', this.onHandlerFilter);
    this.reloadData();
  },

  updateDataSourceHandler(items, offset) {

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items),
      loaded: true,
      cache: {
        offset: offset,
        items : items,
      },
    });
  },

  render() {
    // if (!this.state.loaded) {
    //   return this.renderLoadingView();
    // }

    return (
      <ListView
        enableEmptySections={true}            
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderCell}
        renderSeparator={this.renderSeparator} 
        renderSectionHeader={this.renderSectionHeader}               
      />
    );

  },  

  renderSectionHeader: function(sectionData: string, sectionID: string) {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>{this.state.filterTitle}</Text>
      </View>
    );
  },
 
  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  },

  renderCell(question) {
    return (
      <PracticeUnderstandCell 
        onSelect={() => this.onCellSelected(question)}
        question={question}
      />
    );
  },


  onCellSelected : function(message : Object){

    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: "Answers",
        component: PracticeUnderstandAnswerDetail,
        passProps: {message},
      });
    }
  },

});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  }, 
  listHeader:{
    padding: 3,
    backgroundColor: '#82B6FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeaderText:{
    color: 'white',
    fontWeight: 'bold'
  },
  scrollSpinner: {
    flex: 1,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },  
});

module.exports = PracticeUnderstandList;