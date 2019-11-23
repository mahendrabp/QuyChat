import React, {Component} from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ChatRoom from './Screens/Chat/ChatRoom';
import Login from './Screens/Auth/Login';

const MainNavigator = createStackNavigator({
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
});

export default createAppContainer(MainNavigator);
