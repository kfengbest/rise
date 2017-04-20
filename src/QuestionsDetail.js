
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


var AnswerList = require('./AnswerList');
var HTMLWebView = require('react-native-html-webview');
var Gateway = require('./Gateway');
var CreateCommentView = require('./CreateCommentView');
var Config = require('./Config');
var Communications = require('react-native-communications');
var Dimensions = require('Dimensions');
var DEVICE_WIDTH = Dimensions.get('window').width;
var reactNativeStore = require('react-native-store');
var EventEmitter = require('EventEmitter');


var KudoButton = React.createClass({

  onKudo(){
    Gateway.createKudo(this.props.messageId, (res)=>{
      if (res.status === 'success') {
        var count = this.state.count;
        count += 1;
        this.setState({
          count: count,
          kudoed : true,
        });
      }else if (res.status==='error') {

        if (res.error.code === 303) {
          AlertIOS.alert(
            'Error',
            'You currently have no writable permission in mobile device, click OK button to send email to request permission?',
            [
              {text: 'OK', onPress: ()=>{
                var subject = 'Request writable permission for ' + Gateway.session.last_login_data.userId;
                var bodyText = 'Please grant writable permission for user ' + Gateway.session.last_login_data.userId + ' to access to Fusion 360 forum in mobile device. Thanks.';
                var email = 'fusion360.forum.mobile.dev@autodesk.com';
                Communications.email([email],null,null,subject,bodyText);
              }},
              {text: 'Cancel', onPress: ()=>{

              }}
            ]
          ) 

        }else{
          AlertIOS.alert(
            'Error',
            res.error.message,
            [
              {text: 'OK', onPress: () => console.log('Foo Pressed!')},
            ]
          )                                        
        }

      }

    });
  },


  getInitialState: function() {
    return {
      count: 0,
      kudoed: false
    };
  },

  componentDidMount() {
    Gateway.kudosCount(this.props.messageId, (res)=>{
      if (res && res.size) {
        var size = res.size;
        var curUserId = Gateway.session.last_login_data.userId;
        var found = res.items.some((e)=>{return e.user.id === curUserId;});
        this.setState({
          count: size,
          kudoed : found,
        });
      }
    });
  },

  render(){
    if (this.state.kudoed) {
      return(
        <Text style={styles.buttonTextDisabled}>{this.state.count}
          <Text> Kudos</Text>
        </Text>
      );
    }
    return (
      <TouchableOpacity 
        onPress={this.onKudo}
        style={styles.button}
      >
        <Text style={styles.buttonFont}>{this.state.count}
          <Text> Kudos</Text>
        </Text>

      </TouchableOpacity>
    );    
  },
});

var CommentButton = React.createClass({
  render(){
    return (
      <TouchableOpacity 
        onPress={this.props.onComment}
        style={styles.button}
      >
        <Text style={styles.buttonFont}>Comment
        </Text>

      </TouchableOpacity>
    );    
  },
});

var EmailButton = React.createClass({

  onShare(){
    var subject = this.props.message.subject;
    var bodyText = "Please checkout this post in Fusion 360 community: " + this.props.message.view_href;
    Communications.email(null,null,null,subject,bodyText);
  },

  render(){
    return (
      <TouchableOpacity 
        onPress={this.onShare}
        style={styles.button}
      >
        <Text style={styles.buttonFont}>Share</Text>
      </TouchableOpacity>
    );    
  },
});

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
    this.checkInFavoriteList().done();
    this.markAsRead(this.props.message);
  },

  async checkInFavoriteList() {
    var key = this.props.message.id;
    var that = this;
    reactNativeStore.model(Config.TB_FAVORITES).then((db)=>{
      db.find({id:key}).then((data)=>{
        var isFav = data.length > 0 ? true : false;
        var title = isFav? "UnFavorite" : "Favorite";
        that.setState({
            inFavoriteList: isFav,
            favTitle: title,
          });
      });
    });
  },

  // move the mark as saved state from cell to detail view
  // in order to improve the performance.
  async markAsRead(message) {

    var item = {
      id: message.id,
      messages_count: message.conversation.messages_count
    }

    reactNativeStore.model(Config.TB_READED).then((db)=>{
      db.find({id:message.id}).then((data)=>{
        if (data.length> 0) {
          db.update(item, {id:message.id});
        }else{
          db.add(item);
        }
      });
    });
  },  

  async onFavoritePressed() {

    var key = this.props.message.id;
    var item = this.props.message;
    var that = this;

    reactNativeStore.model(Config.TB_FAVORITES).then(function(db){

      db.find({id:key}).then(function(data){
        if (data.length > 0) {
          db.remove({id:key});
          that.setState({
            inFavoriteList: false,
            favTitle: "Favorite",
          });
        }else{
          db.add(item).then(()=>{
            that.setState({
              inFavoriteList: true,
              favTitle: "UnFavorite",
            });
          });
        }
      });
    });
  },

  onCommentChanged(text){
    this.setState({
      newComment: text,
    });
  },

  onComment() {
      var that = this;

      this.props.navigator.push({
        title: "Comment",
        component: CreateCommentView,
        leftButtonTitle: 'cancel',
        onLeftButtonPress: ()=> {
          this.setState({
            newComment: '',
          })
          this.props.navigator.pop();
        },
        rightButtonTitle: 'done',
        onRightButtonPress: ()=>{
          if (this.state.newComment) {
            var encodedComment = this.state.newComment;
            var regRN = /\n/g;
            encodedComment = encodedComment.replace(regRN,"<br />");

            Gateway.createComment(that.props.message.board.id, 
                                  this.props.message.id,
                                  'RE: ' + this.props.message.subject,
                                  encodedComment,
                                  (res)=>{
                                    if (res.status==='error') {

                                      if (res.error.code === 303) {
                                        AlertIOS.alert(
                                          'Error',
                                          'You currently have no writable permission in mobile device, click OK button to send email to request permission?',
                                          [
                                            {text: 'OK', onPress: ()=>{
                                              var subject = 'Request writable permission for ' + Gateway.session.last_login_data.userId;
                                              var bodyText = 'Please grant writable permission for user ' + Gateway.session.last_login_data.userId + ' to access to Fusion 360 forum in mobile device. Thanks.';
                                              var email = 'fusion360.forum.mobile.dev@autodesk.com';
                                              Communications.email([email],null,null,subject,bodyText);
                                            }},
                                            {text: 'Cancel', onPress: ()=>{

                                            }}
                                          ]
                                        ) 

                                      }else{
                                        AlertIOS.alert(
                                          'Error',
                                          res.error.message,
                                          [
                                            {text: 'OK', onPress: () => console.log('Foo Pressed!')},
                                          ]
                                        )                                        
                                      }

                                    }else if (res.status==='success') {
                                      that.state.eventEmitter.emit('newCommentEvent', res.message);
                                      this.setState({
                                        newComment: '',
                                      })
                                      this.props.navigator.pop();
                                    }
                                  }
                                );
          }

        },
        passProps: {onTextChanged:this.onCommentChanged},
      });
  },

  async onKudo(){
    
  },
  
  render: function() {

    var profileUrl = "http://autodesk.i.lithium.com/t5/image/serverpage/image-id/157676i2FEB2498C7211AD4/image-dimensions/60x60/image-coordinates/0%2C0%2C394%2C394?v=mpbl-1";

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{this.props.message.subject}</Text>

        <View style={styles.qAuthor}>
          <Image 
            source={{uri:profileUrl}}
            style={styles.qAuthorProfile}
          />
          <Text style={styles.qAuthorName}>{this.props.message.author.login}</Text>
          <Text style={styles.qAuthorTitle}></Text>
        </View> 

        <HTMLWebView 
          html={this.props.message.body} 
          style={styles.webView}
          autoHeight={true}
        />

        <View style={styles.separator} />
        <View style={styles.toolBar}>
          <TouchableOpacity 
            onPress={this.onFavoritePressed}
            style={styles.button}
          >
            <Text style={styles.buttonFont}>{this.state.favTitle}</Text>
          </TouchableOpacity>
          <KudoButton messageId={this.props.message.id}/>
          <CommentButton 
            onComment={this.onComment} 
            count={this.props.message.conversation.messages_count}
          />
          <EmailButton 
            message={this.props.message}
          />          
        </View>
        <View style={styles.separator} />
        <AnswerList 
          messageid={this.props.message.id}
          boardid={this.props.message.board.id} 
          events={this.state.eventEmitter} 
        />
        <View style={styles.separator} />
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
