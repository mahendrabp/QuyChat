import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Form, Item, Label, Input, Icon, Button} from 'native-base';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import {WaveIndicator} from 'react-native-indicators';
// import Icon from 'react-native-vector-icons/FontAwesome5';
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
        this.props.navigation.navigate('Mate', {email: this.state.email});
      })
      .catch(() => {
        this.setState({error: 'Authentication Failed', isLoading: false});
        Alert.alert('Eror', 'email atau password salah');
      });
  };

  _renderBtnSignIn = () => {
    if (this.state.isLoading == true) {
      return <WaveIndicator color="#3C82FF" />;
    } else {
      return (
        <View>
          <Button
            block
            style={{
              height: 50,
              backgroundColor: '#3076E0',
            }}
            onPress={this.handleLogin}>
            <Text style={{color: '#ffffff', fontWeight: 'bold', fontSize: 18}}>
              MASUK
            </Text>
          </Button>
        </View>
      );
    }
  };

  onChangeTextEmail = email => this.setState({email});
  onChangeTextPassword = password => this.setState({password});

  render() {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          height: '100%',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '90%',
            height: '90%',
            alignSelf: 'center',
            paddingVertical: 70,
            flex: 1,
            marginTop: 10,
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../Assets/Logo2.png')}
              style={{width: 110, height: 110, borderRadius: 110 / 2}}
            />
          </View>
          <View style={{alignItems: 'center', marginBottom: 60}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>QuyChat</Text>
            <Text>Selamat Datang Kembali</Text>
          </View>
          <View style={{marginVertical: 20}}>
            <Item regular error>
              <Input
                placeholder="email anda"
                onChangeText={email => this.setState({email})}
                onSubmitEditing={() => this.handleLogin}
              />
              <Icon name="close-circle" />
            </Item>
          </View>
          <View>
            <Item regular success last>
              <Input
                placeholder="password anda"
                onChangeText={password => this.setState({password})}
                onSubmitEditing={() => this.handleLogin}
              />
              <Icon name="checkmark-circle" />
            </Item>
          </View>

          <View style={{marginVertical: 20, height: 20}}>
            {this._renderBtnSignIn()}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'center',
            }}>
            <Text>Belum punya akun ? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={styles.textBlue}>Daftar Disini.</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    width: '50%',
  },
  textBlue: {
    color: '#3076E0',
  },
});

export default Login;
