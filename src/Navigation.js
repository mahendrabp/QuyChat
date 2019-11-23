import React, {Component} from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ChatRoom from './Screens/Chat/ChatRoom';
import Login from './Screens/Auth/Login';
import SignUp from './Screens/Auth/SignUp';
import Welcome from './Screens/Welcome';

const MainNavigator = createStackNavigator({
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      header: null,
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions: {
      header: null,
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(MainNavigator);
