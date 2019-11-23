import React, {Component} from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import {Button} from 'native-base';

export default class SplashScreen extends Component {
  //   componentDidMount() {
  //     if (
  //       AsyncStorage.getItem('Authorization') !== null &&
  //       AsyncStorage.getItem('Authorization') !== ''
  //     ) {
  //       this.props.navigation.replace('MenuTabs');
  //     } else {
  //       setTimeout(() => {
  //         this.props.navigation.navigate('IntroScreen');
  //       }, 4000);
  //     }
  //     setTimeout(() => {
  //       this.props.navigation.navigate('IntroScreen');
  //     }, 4000);
  //   }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 'auto',
            marginTop: 40,
          }}>
          <Text style={styles.textScreen}>Halo!</Text>
          <Text style={styles.textScreen2}>Selamat datang di QuyChat</Text>
        </View>
        <View>
          <Image
            source={require('../Assets/Welcome.png')}
            style={{width: 325, height: 325, borderRadius: 325 / 2}}
          />
        </View>
        <View
          style={{
            marginTop: 'auto',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <Text
            style={{
              marginTop: 'auto',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            Klik "Setuju dan Lanjutkan"
          </Text>
          <Button
            block
            style={styles.btnColor}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.textBtn}>SETUJU DAN LANJUTKAN</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textScreen: {
    color: '#3076E0',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textScreen2: {
    fontSize: 25,
  },
  btnColor: {
    backgroundColor: '#3076E0',
    color: '#ffffff',
    width: 10000,
  },
  textBtn: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
