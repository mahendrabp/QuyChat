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
import ListChat from './Screens/Chat/ListChat';
import ListMate from './Screens/Mate/ListMate';
import InitNavigation from './Screens/InitNavigation';
import Logout from './Screens/Auth/Logout';

const TabNavigation = createMaterialBottomTabNavigator(
  {
    ListChat: {
      screen: ListChat,
      navigationOptions: {
        tabBarLabel: 'Obrolan',
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
    ListMate: {
      screen: ListMate,
      navigationOptions: {
        tabBarLabel: 'Mate',
        tabBarIcon: ({tintColor}) => (
          <View>
            <MaterialCommunityIcons
              style={[{color: tintColor}]}
              size={25}
              name={'account-group'}
            />
          </View>
        ),
      },
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        tabBarLabel: 'Profil',
        tabBarIcon: ({tintColor}) => (
          <View>
            <MaterialCommunityIcons
              style={[{color: tintColor}]}
              size={25}
              name={'face-profile'}
            />
          </View>
        ),
      },
    },
  },
  {
    activeColor: '#3C82FF',
    inactiveColor: '#979797',
    barStyle: {backgroundColor: '#fff'},
  },
);

const MainNavigator = createStackNavigator(
  {
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
    InitNavigation: {
      screen: InitNavigation,
    },
    Mate: TabNavigation,
  },
  {
    headerMode: 'none',
    // initialRouteName: 'Maps',
    initialRouteName: 'InitNavigation',
    // initialRouteKey: 'Login',
  },
);

export default createAppContainer(MainNavigator);
