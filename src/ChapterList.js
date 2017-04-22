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
var ChapterCell = require('./ChapterCell');

var PracticeList = require('./PracticeList');
var Gateway = require('./Gateway');
var Config = require('./Config');

import KnowledgePractices from '../data/knowledge_practices.json';  


var ChapterList = React.createClass({

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

    var items = this.props.message.chapterList;
    var offset = 0;

    this.updateDataSourceHandler(items, offset);

  },

  appendData() {
    console.log("listview appendData");
  },

  reloadMostViewedInNDays(append){

    var offset = 0;
    if (append) {
      offset = this.state.cache.offset + 1;
    };
    var boardId = this.props.board.id;
    var that = this;
    return Gateway.mostViewedInNDays(7, boardId, offset, (items) => {
      if (append) {
        if (items.length === 0) {
          that.state.noMore = true;
        }        
        that.state.cache.items.push(...items);
        items = that.state.cache.items;
      };
      return this.updateDataSourceHandler(items, offset);
    }); 
  },



  componentDidMount() {
    //this.addListenerOn(this.props.events, 'filterEvent', this.onHandlerFilter);
    this.reloadData();
  },

  onHandlerFilter: function(args){
    if (args.title === "Cancel") {
      return;
    }

    this.state.filterIndex = args.index;
    this.setState({
      loaded: false,
      filterTitle: args.title,
    });

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
      <ChapterCell 
        onSelect={() => this.onCellSelected(question)}
        question={question}
      />
    );
  },


  onCellSelected : function(message : Object){

    var knowId = message.sections[0].knowledge.id;
    var practices = KnowledgePractices[knowId];

    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: "Practices",
        component: PracticeList,
        passProps: {practices},
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

module.exports = ChapterList;