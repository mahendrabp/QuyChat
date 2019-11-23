import React, {Component} from 'react';
import {View, Text} from 'react-native';
import MainNavigator from './src/Navigation';
import {Root} from 'native-base';

class App extends Component {
  render() {
    return (
      <Root>
        <MainNavigator />
      </Root>
    );
  }
}

export default App;
