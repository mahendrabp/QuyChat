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
import Location from './Screens/Mate//Location';
import MateProfile from './Screens/Mate/MateProfile';
import Profile from './Screens/Profile/Profile';
import EditProfile from './Screens/Profile/EditProfile';
import Other from './Screens/Other/Other';

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
        tabBarLabel: 'Status',
        tabBarIcon: ({tintColor}) => (
          <View>
            <MaterialCommunityIcons
              style={[{color: tintColor}]}
              size={25}
              name={'book-open-page-variant'}
            />
          </View>
        ),
      },
    },
    Profile: {
      screen: Profile,
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
    activeColor: '#1F95CC',
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
    // ChatRoom: {
    //   screen: ChatRoom,
    //   navigationOptions: {
    //     header: null,
    //   },
    // },
    MateProfile: {
      screen: MateProfile,
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
    Location: {
      screen: Location,
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
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        header: null,
      },
    },
    Other: {
      screen: Other,
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
