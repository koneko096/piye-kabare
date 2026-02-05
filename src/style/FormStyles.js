import { StyleSheet } from 'react-native';

const FormStyles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 20,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    margin: 5,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textInput: {
    height: 36,
    padding: 4,
    margin: 5,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    alignSelf: 'stretch',
    textAlign: 'center',
    placeholderTextColor: '#48BBEC',
    color: '#555555'
  },
  loading: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    padding: 8
  }
});

export default FormStyles;