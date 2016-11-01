import React, { Component } from 'react';
import { View, ListView, StyleSheet, Text } from 'react-native';

import Row from './Row';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default class ContentList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.dataSource),
    };
  }

  onClick() {
    this.props.onClick();
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => 
          <Row onClick={this.onClick.bind(this)} {...data} />
        }
      />
    );
  }
}