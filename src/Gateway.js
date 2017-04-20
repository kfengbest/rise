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
        
var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;
var FEEDS_22 = 'https://forums.autodesk.com/autodesk/rss/board?board.id=22';
var FUSIONBASE = 'https://api.lithium.com/community/2.0/autodesk/';
var REFRESH_TOEKN_URL = 'https://api.lithium.com/auth/v1/refreshtoken';
var ACCESS_TOKEN_URL = 'https://api.lithium.com/auth/v1/accessToken';

var DOMParser = require('xmldom').DOMParser;
var _ = require('underscore');

var Gateway = {

	postsWithoutReplies : function(boardId, offset, cb){
		var limits = 10;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20messages%20WHERE%20board.id%20%3D%20%27124%27%20AND%20conversation.style%3D%27forum%27%20AND%20replies.count(*)%3D0%20AND%20depth%3D0%20ORDER%20BY%20post_time%20DESC%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		queryLithiumApiV2(url, 'get', function(data){
			var res = [];
			if(data && data.items){
				for(var i = 0; i < data.items.length; i++){

					// remove space to accormodate in ios.
					var body = data.items[i].body;
        			var regex = /(&nbsp;)/ig;
        			data.items[i].body = body.replace(regex, "");

        			//push to queue.
					res.push(data.items[i]);				
				}
			}

			cb(res);
		});
	},

	postsInNDays(nDays, boardId, offset, cb){
		var that = this;
		var limits = 10;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20messages%20WHERE%20board.id%20%3D%20%27${boardId}%27%20AND%20conversation.style%3D%27forum%27%20AND%20depth%3D0%20ORDER%20BY%20conversation.last_post_time%20DESC%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		queryLithiumApiV2(url, 'get', function(data){
			var res = [];
			if (data && data.items) {
				for(var i = 0; i < data.items.length; i++){

					// filter by date.
					var lastPostDate = new Date(data.items[i].conversation.last_post_time);
					var curDate = new Date();
					var delta = curDate.getTime() - lastPostDate.getTime();
					if (delta > nDays*24*60*60*1000) {
						break;
					}

					// remove space to accormodate in ios.
					var body = data.items[i].body;
        			var regex = /(&nbsp;)/ig;
        			data.items[i].body = body.replace(regex, "");

        			//push to queue.
					res.push(data.items[i]);				
				}
			}
			cb(res);
		});		
	},

	mostViewedInNDays(days, boardId, offset, cb){
		var now = new Date();
		var nowMS = now.getTime();
		var pastMS = nowMS - days*24*60*60*1000;
		var that = this;
		var limits = 10;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20messages%20WHERE%20board.id%20%3D%20%27${boardId}%27%20AND%20conversation.style%3D%27forum%27%20AND%20depth%3D0%20AND%20conversation.last_post_time%20%3E%20${pastMS}%20AND%20conversation.last_post_time%20%3C%20${nowMS}%20ORDER%20BY%20metrics.views%20DESC%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		
		queryLithiumApiV2(url, 'get', function(data){
			var res = [];
			if(data && data.items){
				for(var i = 0; i < data.items.length; i++){

					// remove space to accormodate in ios.
					var body = data.items[i].body;
        			var regex = /(&nbsp;)/ig;
        			data.items[i].body = body.replace(regex, "");

        			//push to queue.
					res.push(data.items[i]);				
				}
			}

			res = _.sortBy(res, (e)=>{return e.metrics.views;}).reverse();

			cb(res);
		});
	},

	topRepliesInNDays(days, boardId, offset, cb){
		var now = new Date();
		var nowMS = now.getTime();
		var pastMS = nowMS - days*24*60*60*1000;
		var that = this;
		var limits = 10;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20messages%20WHERE%20board.id%20%3D%20%27${boardId}%27%20AND%20conversation.style%3D%27forum%27%20AND%20depth%3D0%20AND%20conversation.last_post_time%20%3E%20${pastMS}%20AND%20conversation.last_post_time%20%3C%20${nowMS}%20ORDER%20BY%20conversation.messages_count%20DESC%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		
		queryLithiumApiV2(url, 'get', function(data){
			var res = [];
			if(data && data.items){
				for(var i = 0; i < data.items.length; i++){

					// remove space to accormodate in ios.
					var body = data.items[i].body;
        			var regex = /(&nbsp;)/ig;
        			data.items[i].body = body.replace(regex, "");

        			//push to queue.
					res.push(data.items[i]);				
				}
			}

			res = _.sortBy(res, (e)=>{return e.conversation.messages_count;}).reverse();

			cb(res);
		});
	},
	allComments : function(boardId, messageId, offset, cb){
		var limits = 100;
		var offsets = offset * limits;		
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20messages%20WHERE%20board.id%20%3D%20%27${boardId}%27%20AND%20topic.id%3D%27${messageId}%27%20AND%20depth%3E0%20ORDER%20BY%20post_time%20DESC%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		queryLithiumApiV2(url, 'get', function(data){
			var res = [];
			if(data && data.items){
				res = data.items;
		        res = Array.prototype.map.call(res, (e)=>{
		          var body = e.body;
		          var regex = /(&nbsp;)/ig;
		          e.body = body.replace(regex, "");
		          return e;
		        });
			}

			cb(res);			
		});
	},

	createComment: function(boardId, messageId, subject, comment, cb){
		var userId = this.session.last_login_data.userId;
		var url = `https://api.lithium.com/community/v1/autodesk/messages/id/${messageId}/reply?message.author=/users/id/${userId}&message.body=${comment}&message.subject=${subject}&restapi.response_format=json`;
		queryLithiumApiV1(url, 'post', cb);
	},

	createKudo: function(messageId, cb){
		var url = `https://api.lithium.com/community/v1/autodesk/messages/id/${messageId}/kudos/give?restapi.response_format=json`;
		queryLithiumApiV1(url, 'post', cb);		
	},

	kudosCount : function(messageId,cb){
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20user.id%20FROM%20kudos%20WHERE%20message.id%20%3D%20%27${messageId}%27%20LIMIT%2010000`;
		queryLithiumApiV2(url, 'get', cb);
	},

	allProducts: function(offset, cb){
		var limits = 20;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20title%2C%20id%20from%20categories%20LIMIT%20${limits}%20OFFSET%20${offsets}`;
		queryLithiumApiV2(url, 'get', cb);
	},

	allBoards: function(productId,offset, cb){
		var limits = 20;
		var offsets = offset * limits;
		var url = `https://api.lithium.com/community/2.0/autodesk/search?q=SELECT%20*%20FROM%20boards%20WHERE%20ancestor_categories.id%20%3D%20%27${productId}%27`;
		queryLithiumApiV2(url, 'get', cb);
	},

	getOAuth2AccessToken: function(){
		if (this.session) {
			return 'Bearer ' + this.session.last_login_data.access_token;
		}
		return 'Bearer ';
	},

	accessToken: function(code){
      return fetch(ACCESS_TOKEN_URL, {
        method: 'post',
        headers:{
          'Content-Type': 'application/json',
          'client-id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
        },
        body: JSON.stringify({
          'client_id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
          'client_secret': 'FUE+A+y136VOHNOD8N2i1fbPELWfOKNUTLqp4VCwgsA=',
          'grant_type': 'authorization_code',
          'redirect_uri': 'https://forums.autodesk.com',
          'code': code
        })
      }).then((response) => response.json())
        .then((responseData) => {
          console.log('access_toke', responseData.response.data);
          Gateway.session = {
            last_login_time : new Date(),
            last_login_data : responseData.response.data
          };

        });
	},

	refreshToken: function(){
	  var that = this;
      fetch(REFRESH_TOEKN_URL, {
        method: 'post',
        headers:{
          'Content-Type': 'application/json',
          'client-id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
        },
        body: JSON.stringify({
          'client_id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
          'client_secret': 'FUE+A+y136VOHNOD8N2i1fbPELWfOKNUTLqp4VCwgsA=',
          'refresh_token': that.session.last_login_data.refresh_token,
        })
      }).then((response) => response.json())
        .then((responseData) => {

          console.log('refresh token: ', responseData.response.data);

          that.session = {
            last_login_time : new Date(),
            last_login_data : responseData.response.data
          };

        })
        .catch((err) => console.log(err))
        .done();

	},	
};


function getFeeds(cb){
	fetch(FEEDS_22)
	  .then((response) => response.text())
	  .then((responseText) => {
	  	var results = [];
	    var parser = new DOMParser()
    	var doc = parser.parseFromString(responseText,"text/xml").documentElement
    	var channelNode = doc.getElementsByTagName("channel")[0];
		var items = channelNode.getElementsByTagName("item");

		var channelTitle = channelNode.getElementsByTagName("title")[0].firstChild.data;

		for(var i=0;i<items.length;i++){
			var post = {};
			var itemElem = items[i];

			post.title = itemElem.getElementsByTagName("title")[0].firstChild.data;
			post.description = itemElem.getElementsByTagName("description")[0].firstChild.data;
			post.username = itemElem.getElementsByTagName("dc:creator")[0].firstChild.data;
			post.link = itemElem.getElementsByTagName("link")[0].firstChild.data;
			post.pubdate = itemElem.getElementsByTagName("pubDate")[0].firstChild.data;
			post.channel = channelTitle;
			results[i] = post;
		}

	  	cb(results);
	  })
	  .done();		
}

function queryLithiumApiV2(url, method, cb){
	fetch(url,{
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'client-id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
			'Authorization': Gateway.getOAuth2AccessToken()
		}
	  })
	  .then((response) => response.json())
	  .then((responseData) => {
	  	cb(responseData.data);
	  })
	  .done();	
}

function queryLithiumApiV1(url, method, cb){
	fetch(url,{
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'client-id': 'mq/VPxnm+RpNN0Q+lCxLfiz/y2pMYnpM6hEXKkVZMRw=',
			'Authorization': Gateway.getOAuth2AccessToken()
		}
	  })
	  .then((response) => response.json())
	  .then((responseData) => {
	  	cb(responseData.response);
	  })
	  .done();	
}

function getMovies(cb){
	fetch(REQUEST_URL)
	  .then((response) => response.json())
	  .then((responseData) => {
	  	cb(responseData.movies);
	  })
	  .done();	
};

module.exports = Gateway;