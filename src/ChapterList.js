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

var PracticeAppliedList = require('./PracticeAppliedList');
var PracticeUnderstandList = require('./PracticeUnderstandList');
var PracticeDetail = require('./PracticeDetail');

var Gateway = require('./Gateway');
var Config = require('./Config');

import KnowledgePractices from '../data/knowledge_practices.json';  
import KnowledgeUnderstands from '../data/unique_understand_ids.json';  


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
    var chapters = this.props.message.chapterList;
    var items = [];
    chapters.forEach(function(e){
      e.sections.forEach(function(s){
        var chapter = {
          chapter: e.chapter,
          section: s,
          name: e.name,
          integrated: e.integrated
        };
        items.push(chapter);        
      });
    });
    // for(var e in chapters){
    //   for(var section in e.sections){
    //     var chapter = {
    //       chapter: e.chapter,
    //       section: section,
    //       name: e.name,
    //       integrated: e.integrated
    //     };
    //     items.append(chapter);
    //   }      
    // }

    this.updateDataSourceHandler(items, 0);

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
      <ChapterCell 
        onSelect={() => this.onCellSelected(question)}
        question={question}
      />
    );
  },


  onCellSelected : function(message : Object){

    var knowId = message.section.knowledge.id;
    var practicesApplied = KnowledgePractices[knowId];
    var practicesUnderstand = KnowledgeUnderstands[knowId];
    var knowledge = message.section.knowledge;

    var practice = {
      'applied': practicesApplied,
      'understand': practicesUnderstand,
      'knowledge': knowledge
    };

    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: "Practices",
        component: PracticeDetail,
        passProps: {practice},
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