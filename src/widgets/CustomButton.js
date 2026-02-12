import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, style, textStyle, underlayColor = "#99d9f4", ...props }) => {
    return (
        <TouchableHighlight
            style={[styles.button, style]}
            onPress={onPress}
            underlayColor={underlayColor}
            {...props}
        >
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
    },
});

export default CustomButton;
