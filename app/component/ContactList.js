import React, { Component } from 'react';
import { View, ListView, StyleSheet, Text } from 'react-native';

import Row from './Row';

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C4C4C4'
  }
});

export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.dataSource),
      isDataChanged: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) { return this.state.isDataChanged; }

  componentWillUpdate(nextProps, nextState) {
    this.setState({ isDataChanged: false });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.ds.cloneWithRows(nextProps.dataSource),
      isDataChanged: true
    });
  }

  onClick(id) {
    this.props.onClick(id);
  }

  render() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={(data) => 
          <Row onClick={this.onClick.bind(this)} {...data} />
        }
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );
  }
}