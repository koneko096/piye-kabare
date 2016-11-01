import React, { Component } from 'react';
import { 
  Image ,
  StyleSheet, 
  Text, 
  TouchableHighlight,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  }
});

export default class Row extends Component {
  onClick() {
    // console.log(this.props.id)
    // console.log(this.props.onClick);
    this.props.onClick();
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.onClick}
        underlayColor='#C3C3C3'>
        <View style={styles.container}>
          <Text style={styles.text}>
            {`${this.props.name}`}
          </Text>
        </View>
      </TouchableHighlight>  
    );
  }
};