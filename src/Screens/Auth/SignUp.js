import {StyleSheet, TextInput, ToastAndroid} from 'react-native';
import {
  Container,
  View,
  Item,
  Input,
  Text,
  Thumbnail,
  Button,
  Toast,
  Spinner,
} from 'native-base';
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
      name: '',
      isError: '',
      isLoading: false,
      showToast: false,
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

  handleSignUp = async () => {
    //init state when click
    this.setState({
      isError: '',
      isLoading: true,
    });

    const {email, password} = this.state;
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const user = firebase.auth().currentUser;
        const dbUser = firebase.database().ref(`/users/${user.uid}`);

        return dbUser
          .set({
            email: this.state.email,
            name: this.state.name,
            phone: this.state.phone,
            avatar: `https://ui-avatars.com/api/?rounded=true&name=${this.state.name}`,
          })
          .then(() => dbUser.once('value'))
          .then(snapshot => ({auth: user, snapshot}));
      })
      .then(({auth, snapshot}) => {
        const data = snapshot.val();
        // return AsyncStorage.setItem(
        //   'user:data',
        //   JSON.stringify({uid: auth.uid, ...data}),
        // );
      })
      .then(() => {
        ToastAndroid.showWithGravity(
          'Berhasil',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        ToastAndroid.showWithGravity(
          `${err.message}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return false;
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
        <Text style={styles.title}>Nama:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="Nama anda"
          onChangeText={name => this.setState({name})}
        />
        <Text style={styles.title}>Telepon:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="Telepon anda"
          onChangeText={phone => this.setState({phone})}
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
          onPress={() => this.props.navigation.navigate('Login')}
        />

        <Button
          title="Signup"
          style={styles.buttonText}
          onPress={this.handleSignUp}
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
