import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const Row = ({ name, id, onClick }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <TouchableHighlight
      onPress={() => onClick(id)}
      underlayColor="#C3C3C3"
    >
      <View style={styles.container}>
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'navajowhite',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333'
  }
});

export default Row;