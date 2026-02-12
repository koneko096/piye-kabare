import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getAvatarUrl } from '../utils/avatar';

const Row = ({ item, onClick }) => {
  const avatarUrl = getAvatarUrl(item.name);

  return (
    <TouchableOpacity
      onPress={() => onClick()}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  }
});

export default Row;