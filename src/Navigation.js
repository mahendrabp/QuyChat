import React, {Component} from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatRoom from './Screens/Chat/ChatRoom';
import Login from './Screens/Auth/Login';
import SignUp from './Screens/Auth/SignUp';
import Welcome from './Screens/Welcome';

const TabNavigation = createMaterialBottomTabNavigator(
  {
    Friend: {
      screen: Friend,
      navigationOptions: {
        tabBarLabel: 'Friends',
        tabBarIcon: ({tintColor}) => (
          <View>
            <MaterialIcons
              style={[{color: tintColor}]}
              size={25}
              name={'person'}
            />
          </View>
        ),
      },
    },
    ListChat: {
      screen: ListChat,
      navigationOptions: {
        tabBarLabel: 'Chats',
        tabBarIcon: ({tintColor}) => (
          <View>
            <MaterialCommunityIcons
              style={[{color: tintColor}]}
              size={25}
              name={'chat-processing'}
            />
          </View>
        ),
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarLabel: 'More',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Ionicons
              style={[{color: tintColor}]}
              size={25}
              name={'ios-more'}
            />
          </View>
        ),
      },
    },
  },
  {
    activeColor: '#202a43',
    inactiveColor: '#979797',
    barStyle: {backgroundColor: '#fff'},
  },
);

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
