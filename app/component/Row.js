import React, { Component } from 'react';
import { 
  Image ,
  StyleSheet, 
  Text, 
  TouchableHighlight,
  View
} from 'react-native';

import MaterialInitials from 'react-native-material-initials/native';

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
    this.props.onClick(this.props.id);
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.onClick.bind(this)}
        underlayColor='#C3C3C3'>
        <View style={styles.container}>
          <MaterialInitials
            style={{alignSelf: 'center'}}
            backgroundColor={'navajowhite'}
            color={'white'}
            size={40}
            text={this.props.name.toUpperCase()}
            single={false}
          />
          <Text style={styles.text}>
            {this.props.name}
          </Text>
        </View>
      </TouchableHighlight>  
    );
  }
};