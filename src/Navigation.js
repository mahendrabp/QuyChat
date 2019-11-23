import React, {Component} from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import ChatRoom from './Screens/Chat/ChatRoom';

const MainNavigator = createStackNavigator({
  ChatRoom: {
    screen: ChatRoom,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(MainNavigator);
