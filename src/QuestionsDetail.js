
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

//var AnswerList = require('./AnswerList');
//var HTMLWebView = require('react-native-html-webview');
var Gateway = require('./Gateway');
var Config = require('./Config');
var Communications = require('react-native-communications');
var reactNativeStore = require('react-native-store');
var EventEmitter = require('EventEmitter');



var QuestionsDetail = React.createClass({

  getInitialState: function() {
    return {
      commentsdata: [],
      htmlbody:'<p>aaaaa</p>',
      inFavoriteList : false,
      favTitle : "Favorite",
      newComment: '',
      eventEmitter: new EventEmitter()
    };
  },

  componentDidMount() {

  },

  
  render: function() {

    var profileUrl = "http://autodesk.i.lithium.com/t5/image/serverpage/image-id/157676i2FEB2498C7211AD4/image-dimensions/60x60/image-coordinates/0%2C0%2C394%2C394?v=mpbl-1";

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>"this.props.message.subject"</Text>

        <View style={styles.qAuthor}>
          <Image 
            source={{uri:profileUrl}}
            style={styles.qAuthorProfile}
          />
          <Text style={styles.qAuthorName}>"this.props.message.author.login"</Text>
          <Text style={styles.qAuthorTitle}></Text>
        </View> 
      </ScrollView>
    );
  },
});

var styles = StyleSheet.create({
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
  }
});

module.exports = QuestionsDetail;
