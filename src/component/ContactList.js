import { View, FlatList, StyleSheet } from 'react-native';
import Row from './Row';

const ContactList = ({ dataSource, onClick }) => {
  const renderItem = ({ item }) => (
    <Row onClick={() => onClick(item.id)} {...item} />
  );

  return (
    <FlatList
      data={dataSource}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C4C4C4',
  }
});

export default ContactList;