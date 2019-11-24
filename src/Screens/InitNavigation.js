import React, {Component} from 'react';
import * as firebase from 'firebase';

class InitNavigation extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('Logged in!!!');
        this.props.navigation.replace('Mate');
      } else {
        this.props.navigation.replace('Login');
      }
    });
  }

  render() {
    return <></>;
  }
}

export default InitNavigation;
