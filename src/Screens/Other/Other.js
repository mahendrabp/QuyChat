import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Button} from 'native-base';
import LottieView from 'lottie-react-native';

export default class Other extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 25, marginTop: '20%'}}>
          Sedang Dikerjakan Nih ....
        </Text>
        <LottieView
          source={require('../../Assets/animations/5941-jumbo-typing.json')}
          autoPlay
          loop
        />
      </View>
    );
  }
}
