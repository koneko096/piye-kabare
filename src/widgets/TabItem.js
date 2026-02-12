import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TabItem = ({ title, isActive, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={onPress}
        >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#48BBEC',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#48BBEC',
        fontWeight: 'bold',
    },
});

export default TabItem;
