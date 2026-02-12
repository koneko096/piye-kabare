import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const FormInput = ({ value, onChangeText, placeholder, secureTextEntry, ...props }) => {
    return (
        <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            underlineColorAndroid="transparent"
            placeholder={placeholder}
            placeholderTextColor="#888888"
            secureTextEntry={secureTextEntry}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    textInput: {
        height: 48,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
});

export default FormInput;
