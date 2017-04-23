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
var AnswerCell = require('./AnswerCell');

var QuestionsDetail = require('./QuestionsDetail');
var Gateway = require('./Gateway');
var Config = require('./Config');

import AnswersData from '../data/practices/practice_applied_answer_1_1.json';  
import RNFetchBlob from 'react-native-fetch-blob'


var AnswerList = React.createClass({

  mixins: [Subscribable.Mixin],

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false,
      noMore: false,
      cache: {offset: 0, items:[]}, 
      filterIndex : 0,
      filterTitle : 'Most recents'
    };
  },

  reloadData() {
    this.state.noMore = false;
    this.appendData(1);
  },

  appendData(offsetInt) {
    const dirs = RNFetchBlob.fs.dirs;
    var pId = this.props.message.msg.id;
    var answerName = '/practice_applied_answer_' + pId + '_' + offsetInt.toString() + '.json';
    const filePath = dirs.MainBundleDir + answerName;
    var that = this;
    console.log(answerName);
    
    RNFetchBlob.fs.readFile(filePath, 'utf8')
      .then((data) => {
        data = JSON.parse(data);
        that.state.cache.items.push(...data.msg.list);
        that.updateDataSourceHandler(that.state.cache.items, 0);

        if (data.msg.end === false) {
          that.appendData(offsetInt+1);
        }

      });
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
      <AnswerCell 
        onSelect={() => this.onCellSelected(question)}
        question={question}
      />
    );
  },


  onCellSelected : function(message : Object){

    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: "Message",
        component: QuestionsDetail,
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

module.exports = AnswerList;