import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {Item, Input, Icon, Button} from 'native-base';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import {SkypeIndicator} from 'react-native-indicators';

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

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
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

  handleBackPress = () => {
    BackHandler.exitApp();
    return true;
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
      return <SkypeIndicator color="#3C82FF" />;
    } else {
      return (
        <>
          {this.state.email.length > 3 && this.state.password.length > 3 ? (
            <Button
              block
              style={{
                backgroundColor: '#3076E0',
              }}
              onPress={this.handleLogin}>
              <Icon name="checkmark-circle-outline" style={{marginRight: 4}} />
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                MASUK
              </Text>
            </Button>
          ) : (
            <Button block disabled onPress={this.handleLogin}>
              <Icon name="hand" style={{marginRight: 4}} />
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                MASUK
              </Text>
            </Button>
          )}
        </>
      );
    }
  };

  // onChangeTextEmail = email => this.setState({email});
  // onChangeTextPassword = password => this.setState({password});

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
            <Item
              regular
              style={{borderWidth: 100}}
              success={!this.state.isEmailValid ? false : true}
              error={!this.state.isEmailValid ? true : false}>
              <Input
                placeholder="email anda"
                onChangeText={email => this.onChangeEmail(email)}
                onSubmitEditing={() => this.handleLogin}
              />
              <Icon
                name={!this.state.isEmailValid ? 'md-mail' : 'checkmark-circle'}
              />
            </Item>
          </View>
          <View>
            <Item regular success last>
              <Input
                secureTextEntry={true}
                placeholder="password anda"
                onChangeText={password => this.setState({password})}
                onSubmitEditing={() => this.handleLogin}
              />
              <Icon name="md-key" />
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
