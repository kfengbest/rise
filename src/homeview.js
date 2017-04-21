'use strict';

import React, { Component, PropTypes } from 'react';
import { Navigator,
        NavigatorIOS, 
        Text, 
        View, 
        TouchableHighlight, 
        StyleSheet,
        AsyncStorage } from 'react-native';


var QuestionsList1 = require('./QuestionsList1');

// var ProductList = require('./ProductList');

var ACTIVE_PRODUCT_KEY = "current_product";

var HomeView = React.createClass({

  async loadProduct(){
    return await AsyncStorage.getItem(ACTIVE_PRODUCT_KEY, );
  },

  getInitialState(){

    // var currentProduct = this.loadProduct().done();
    var defaultProduct = {
      id: '1234',
      title: 'RISE',
    };
    // currentProduct = currentProduct || defaultProduct;

    return {
      product: defaultProduct,
    };

  },

  async onProductChanged(product){
    console.log(product);

//    await AsyncStorage.setItem(ACTIVE_PRODUCT_KEY, JSON.stringify(product));

    this.setState({
      product: product,
    });

    this.refs.nav.pop();
  },

  onProductPressed(){
    this.refs.nav.push({
      title:'products',
      component: QuestionsList1,
      passProps: {onProductChanged: this.onProductChanged},
    });
  },

  render: function() {

    console.log('homeview render', this.state.product);

    return (
        <NavigatorIOS 
          ref='nav'
          style = {styles.container}
          initialRoute={{
            title: this.state.product.title,
            component: QuestionsList1,
            // leftButtonTitle: 'Products',
            // onLeftButtonPress: this.onProductPressed,
            passProps: {productId: this.state.product.id}
          }}
        />
    );
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

module.exports = HomeView;