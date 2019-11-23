import {StyleSheet, Text, TextInput, View, Button, Alert} from 'react-native';
import * as firebase from 'firebase';
import React, {Component} from 'react';
// import firebaseSDK from '../../Configs/firebaseSDK';
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDFGvksTN7eLHLpG4DfHQhnnzhwoMNc5Ls',
    authDomain: 'quychat-bima.firebaseapp.com',
    databaseURL: 'https://quychat-bima.firebaseio.com',
    projectId: 'quychat-bima',
    storageBucket: 'quychat-bima.appspot.com',
    messagingSenderId: '633612731220',
    appId: '1:633612731220:web:77c85853c0f71ef2107ec1',
  });
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      phone: '',
      isError: '',
      isLoading: false,
    };
  }

  onChangeEmail = value => {
    let validationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (validationRegex.test(value) === false) {
      this.setState({
        email: value,
        isEmailValid: false,
        invalidEmailMessage: 'email tidak valid',
      });
    } else if (value === '' || value === null) {
      this.setState({
        email: value,
        isEmailValid: false,
        invalidEmailMessage: 'email tidak boleh kosong',
      });
    } else {
      this.setState({
        email: value,
        isEmailValid: true,
      });
    }
  };

  handleLogin = async () => {
    //init state when click
    this.setState({
      isError: '',
      isLoading: true,
    });

    const {email, password} = this.state;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          isError: '',
          isLoading: false,
        });
        this.props.navigation.navigate('ChatRoom', {email: this.state.email});
      })
      .catch(() => {
        this.setState({error: 'Authentication Failed', loading: false});
        Alert.alert('Eror', 'email atau password salah');
      });
  };

  onChangeTextEmail = email => this.setState({email});
  onChangeTextPassword = password => this.setState({password});

  render() {
    return (
      <View>
        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="email anda"
          onChangeText={email => this.setState({email})}
        />
        <Text style={styles.title}>Password:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="password anda"
          onChangeText={password => this.setState({password})}
        />
        <Button
          title="Login"
          style={styles.buttonText}
          onPress={this.handleLogin}
        />

        <Button
          title="Signup"
          style={styles.buttonText}
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginLeft: 16,
    fontSize: 16,
  },
  nameInput: {
    height: 16 * 2,
    margin: 16,
    paddingHorizontal: 16,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: 16,
  },
  buttonText: {
    marginLeft: 16,
    fontSize: 42,
  },
});

export default Login;
