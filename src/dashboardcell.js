/**
 * Created by kaven on 22/11/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

const styles = StyleSheet.create({
    "dbditem": {
        marginTop:3,
        // marginBottom:1,
        borderLeftWidth:3,
        borderLeftColor:"#17a48a",
        backgroundColor:"#dcf9e8",
        height: 30,
        marginLeft:5,
        marginRight: 5,
        paddingTop:5,
        paddingLeft:5,
        paddingRight:2,
    },
    "dbditemtitle": {
        fontSize:16,
        fontWeight:'bold'
    }
});

export default class DashboardCell extends Component {

    constructor (props) {
        super(props);
        this.dbd = props.dashboard;
    }

    render () {
        return (
            <TouchableHighlight onPress={this.props.onSelected}>
                <View style={styles.dbditem}>
                    <Text style={styles.dbditemtitle}>{this.dbd.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}
