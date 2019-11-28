import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Form, Item, Label, Input, Icon, Button, Toast} from 'native-base';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import {SkypeIndicator} from 'react-native-indicators';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import firebaseSDK from '../../Configs/firebaseSDK';
import Geolocation from '@react-native-community/geolocation';

// Geolocation.getCurrentPosition(info => console.log(info));
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

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      phoneNumber: '',
      name: '',
      username: '',
      status: '',
      longitude: 0,
      latitude: 0,
      initLocation: '',
      currentPostion: '',
      isError: '',
      avatar: '',
      isLoading: false,
      showToast: false,
      isButtonDisabled: 'true',
    };
  }

  async componentDidMount() {
    await this.getLocation();
    this.watchID = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        this.setState({
          latitude,
          longitude,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    console.log(this.watchID);
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  watchID: ?number = null;

  async getLocation() {
    await Geolocation.getCurrentPosition(
      position => {
        // console.log(JSON.stringify(position));
        const {latitude, longitude} = position.coords;
        const initLocation = JSON.stringify(position);
        this.setState({
          latitude,
          longitude,
          initLocation,
        });
      },
      error => {
        // console.log(error);
        Alert.alert(error.message);
      },
      {enableHighAccuracy: true, distanceFilter: 1},
    );

    // this.watchId = Geolocation.watchPosition(
    //   position => {
    //     const {latitude, longitude} = position.coords;
    //     console.log(position);
    //     this.setState({
    //       latitude,
    //       longitude,
    //       currentPostion: position,
    //     });
    //   },
    //   error => {
    //     console.log(error);
    //   },
    //   {enableHighAccuracy: true},
    // );
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

  async handleSignUp() {
    //init state when click
    const {
      email,
      password,
      name,
      phoneNumber,
      status,
      latitude,
      longitude,
    } = this.state;
    const usersDatabase = 'users/' + this.state.username;
    //init this collection for firebase
    // const user = firebase.auth().currentUser;
    // const usersDatabase = `/users/${user.uid}`;

    //check if username already in use or not
    firebase
      .database()
      .ref(usersDatabase)
      .once('value', snapshot => {
        if (snapshot.val()) {
          return alert('username sudah dipakai');
        } else {
          this.setState({
            isLoading: true,
          });
          return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(result => {
              // const user = firebase.auth().currentUser;
              const userEdited = this.state.username.replace(/ /g, '_');
              const usersDatabase = 'users/' + userEdited;
              console.log(result);
              result.user.updateProfile({
                displayName: this.state.username.replace(/ /g, '_'),
              });
              const avatar =
                `https://ui-avatars.com/api/?size=256&rounded=true&background=${(
                  ((1 << 24) * Math.random()) |
                  0
                ).toString(16)}&name=` + this.state.username.replace(/ /g, '+');
              firebase
                .database()
                .ref(usersDatabase)
                .set({
                  username: this.state.username.replace(/ /g, '_'),
                  email,
                  phoneNumber,
                  name: this.state.username,
                  status,
                  avatar: avatar,
                  latitude,
                  longitude,
                })
                .then(data => {
                  console.log('Data : ', data);
                })
                .catch(error => {
                  console.log('error', error);
                });
              // console.log(this.state.latitude);
              Toast.show({
                text: 'Akun QuyChat berhasil dibuat',
                buttonText: 'Ok',
                type: 'success',
                duration: 2000,
              });
              this.setState({
                email: '',
                username: '',
                phoneNumber: '',
                password: '',
                isLoading: false,
              });
              this.props.navigation.navigate('Mate');
            })
            .catch(error => {
              Toast.show({
                text: error.message,
                buttonText: 'Ok',
                type: 'danger',
                duration: 3000,
              });
              this.setState({
                isLoading: false,
              });
            });
        }
      });

    this.setState({
      isLoading: false,
    });
  }

  _renderBtnSignUp = () => {
    if (this.state.isLoading === true) {
      return <SkypeIndicator color="#3C82FF" />;
    } else {
      return (
        <>
          {this.state.email.length > 3 &&
          this.state.password.length > 3 &&
          this.state.phoneNumber.length > 5 &&
          this.state.username.length > 1 ? (
            <Button
              block
              style={{
                height: 50,
                backgroundColor: '#3076E0',
              }}
              onPress={() => this.handleSignUp()}>
              <Icon name="checkmark-circle-outline" style={{marginRight: 4}} />
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                DAFTAR
              </Text>
            </Button>
          ) : (
            <Button
              block
              disabled
              style={{
                height: 50,
              }}
              onPress={() => this.handleSignUp()}>
              <Icon style={{marginRight: 4}} name="hand" />
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                DAFTAR
              </Text>
            </Button>
          )}
        </>
      );
    }
  };

  onChangeTextEmail = email => this.setState({email});
  onChangeTextPassword = password => this.setState({password});

  render() {
    return (
      <KeyboardAwareScrollView>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '90%',
              height: '90%',
              alignSelf: 'center',
              paddingVertical: 40,
              flex: 1,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../Assets/Logo2.png')}
                style={{width: 110, height: 110, borderRadius: 110 / 2}}
              />
            </View>
            <View style={{alignItems: 'center', marginBottom: 40, flex: 1}}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>QuyChat</Text>
              <Text>QUY kita ngobrol bareng!</Text>
            </View>

            <View style={{marginVertical: 20}}>
              <Item
                regular
                success={this.state.email.length > 3 ? true : false}>
                <Input
                  placeholder="email anda"
                  onChangeText={email => this.setState({email})}
                />
                <Icon
                  name={
                    this.state.email.length > 3 ? 'checkmark-circle' : 'md-mail'
                  }
                />
              </Item>
            </View>
            <View>
              <Item
                regular
                success={this.state.username.length > 0 ? true : false}
                last>
                <Input
                  placeholder="username anda"
                  onChangeText={username => this.setState({username})}
                />
                <Icon
                  name={
                    this.state.username.length > 0
                      ? 'checkmark-circle'
                      : 'md-contact'
                  }
                />
              </Item>
            </View>
            <View style={{marginVertical: 20}}>
              <Item
                regular
                success={this.state.phoneNumber.length > 7 ? true : false}>
                <Input
                  placeholder="telepon anda"
                  onChangeText={phoneNumber => this.setState({phoneNumber})}
                  keyboardType="numeric"
                />
                <Icon
                  name={
                    this.state.phoneNumber.length > 7
                      ? 'checkmark-circle'
                      : 'md-call'
                  }
                />
              </Item>
            </View>
            <View style={{display: 'flex'}}>
              <Item
                regular
                success={this.state.password.length > 3 ? true : false}
                last>
                <Input
                  placeholder="password anda"
                  onChangeText={password => this.setState({password})}
                  secureTextEntry={true}
                />
                <Icon
                  name={
                    this.state.password.length > 3
                      ? 'checkmark-circle'
                      : 'md-key'
                  }
                />
              </Item>
            </View>
            <View style={{marginVertical: 20, height: 20}}>
              {this._renderBtnSignUp()}
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
                justifyContent: 'center',
              }}>
              <Text>Sudah punya akun ? </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={styles.textBlue}>Masuk Disini.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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

export default SignUp;

// await firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(async () => {
//         const user = firebase.auth().currentUser;
//         const databaseUser = firebase.database().ref(`/users/${user.uid}`);
//         console.log(databaseUser);
//         return databaseUser
//           .set({
//             email: this.state.email,
//             name: this.state.name,
//             phoneNumber: this.state.phoneNumber,
//             avatar: `https://ui-avatars.com/api/?rounded=true&name=${this.state.name}`,
//           })
//           .then(() => databaseUser.once('value'))
//           .then(snapshot => ({auth: user, snapshot}));
//       })
//       .then(({auth, snapshot}) => {
//         const data = snapshot.val();
//         // return AsyncStorage.setItem(
//         //   'user:data',
//         //   JSON.stringify({uid: auth.uid, ...data}),
//         // );
//       })
//       .then(() => {
//         Toast.show({
//           text: 'Berhasil Daftar, Silahkan Login',
//           position: 'bottom',
//           duration: 2000,
//           type: 'success',
//         });
//         this.props.navigation.navigate('Login');
//       })
//       .catch(err => {
//         Toast.show({
//           text: err.message,
//           buttonText: 'Ok',
//           type: 'warning',
//           duration: 2000,
//         });
//         this.setState({
//           isError: '',
//           isLoading: false,
//         });
//         return false;
//       });
