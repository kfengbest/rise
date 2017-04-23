
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
        PixelRatio,
        TouchableOpacity,
        WebView,
        ScrollView,
        AlertIOS } from 'react-native';

var DEVICE_WIDTH=350

var Gateway = require('./Gateway');
var Config = require('./Config');
var Communications = require('react-native-communications');
var reactNativeStore = require('react-native-store');
var EventEmitter = require('EventEmitter');
var ChoiceList = require('./ChoiceList');
var PracticeUnderstandCommentList = require('./PracticeUnderstandCommentList');

import RNFetchBlob from 'react-native-fetch-blob'


var KnowledgeDetail = React.createClass({

  getInitialState: function() {
    return {
      practice: {},
      loaded:false
    };
  },

  componentDidMount() {
    this.reloadData();
  },

  reloadData() {

  },
  
  render: function() {


    var knowledge = this.props.message.knowledge || "";
    var regex = /(&nbsp;|<([^>]+)>)/ig;
    knowledge = knowledge.replace(regex, "");

    var analysis = this.props.message.analysis || "";
    var regex = /(&nbsp;|<([^>]+)>)/ig;
    analysis = analysis.replace(regex, "");

    var means = this.props.message.means || "";
    var regex = /(&nbsp;|<([^>]+)>)/ig;
    means = means.replace(regex, "");

    var keynote = this.props.message.keynote || "";
    var regex = /(&nbsp;|<([^>]+)>)/ig;
    keynote = keynote.replace(regex, "");

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.flexContainer}>

          <View style={styles.flexCell}>            
            <Text style={styles.title}>{knowledge}</Text>
          </View> 

          <View style={styles.flexCell}>   

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>语音:</Text>
            </View>
            <Text style={styles.qDescription} numberOfLines={1}>{this.props.message.audio}</Text>           
          
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>作用:</Text>
            </View>
            <Text style={styles.qDescription} numberOfLines={500}>{analysis}</Text>           
            
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>方法:</Text>
            </View>            
            <Text style={styles.qDescription} numberOfLines={500}>{means}</Text>                       

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>要点:</Text>
            </View>            
            <Text style={styles.qDescription} numberOfLines={500}>{keynote}</Text>                       

                      
          </View>                      
        </View>        
      </ScrollView>
    );
  },

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          loading...
        </Text>
      </View>
    );
  },   

});

var styles = StyleSheet.create({
  flexContainer:{
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  flexCell:{
    flexDirection: 'column',
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
  },
  contentContainer: {
    padding: 10,
  },
  toolBar:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  button:{
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: '500',    
  },
  buttonTextDisabled:{
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',   
    color: 'gray'
  },
  title:{
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 5,
  },
  description:{
    marginTop: 5,
    marginBottom: 10,
  },
  qAuthor:{
    flex: 1,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  qAuthorName:{
    flex: 1,
    margin: 2,
    fontSize: 10,
  },
  qAuthorTitle:{
    flex: 1,
    margin: 2,
    fontSize: 10,
  },
  qAuthorProfile: {
    flex: 1,
    backgroundColor: '#dddddd',
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius:15,
  },
  commentSection: {
    backgroundColor: "#dddddd",
    height: 30,
  },
  htmlText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    margin: 10,
  },  
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    //marginVertical: 10,
  },
  webView: {
    width: DEVICE_WIDTH,
  },
  IMG: {
    position: 'absolute',
    height: 200,
    width: DEVICE_WIDTH,
    backgroundColor: '#ccc'
  },
  buttonFont: {
    color: 'blue'
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
  }
});

module.exports = KnowledgeDetail;
