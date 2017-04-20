/**
 * Created by kaven on 22/11/2016.
 * this is the private dashboard list
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    RefreshControl,
    ListView
} from 'react-native';

import DashboardCell from './dashboardcell'

import unchoosenData from '../data/unchoosen.json';  

export default class DashboardsList extends Component {

    constructor (props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,
                                          sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                                        });
        this.state = {
            refreshing: false,
            dataSource: ds.cloneWithRowsAndSections({
        'section1': ['1'],
        'section2': ['row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2', 'row 1', 'row 2']
      }),
        };

    }

    reloadData () {
        // call rest api to fetch data.

        // this.setState({
        //     refreshing: false,
        //     dataSource: this.state.dataSource.cloneWithRows(data.dashboards)
        // });
    }

    componentDidMount() {
        this.reloadData();
    }

    onCellSelected (data) {
        console.log(data);
        // this.props.nav.pop();
        // this.props.eventEmitter.emit('dashboardChanged', {dashboard: data});
    }

    _renderRow (data) {
        return (
            <DashboardCell
                onSelected={this.onCellSelected.bind(this, data)}
                dashboard={data}
            />
        );
    }

    _renderSectionHeader(data, sectionID){
        if (sectionID === 'section1') {
            return null
        }
        return (
          <View style={styles.section}>
            <View ><Text>category 1</Text></View>
          </View>
        );
    }

    _onRefresh () {

    }

    render () {
        return (
            <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                renderSectionHeader={this._renderSectionHeader.bind(this)}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    />
                }
            />
        )
    }
}

var styles = StyleSheet.create({
  list: {
    marginTop: 64,
  },
  row: {
    height: 50,
    backgroundColor: 'white'
  },
  section: {
    height: 30,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
