import { View, FlatList, StyleSheet } from 'react-native';
import Row from './Row';

const ContactList = (props) => {
  // Extract dataSource and onClick from direct props or route.params
  const dataSource = props.dataSource || props.route?.params?.dataSource;
  const onClick = props.onClick || props.route?.params?.onClick;

  const renderItem = ({ item }) => (
    <Row
      onClick={() => {
        if (onClick) onClick(item);
      }}
      {...item}
    />
  );

  return (
    <FlatList
      data={dataSource || []}
      renderItem={renderItem}
      keyExtractor={(item, index) => (item.id || item._id || index).toString()}
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