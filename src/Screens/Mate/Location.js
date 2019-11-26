import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Content,
  Icon,
  Text,
  Grid,
  Row,
  Col,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
} from 'native-base';

import * as firebase from 'firebase';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      avatar: '',
      status: '',
      mates: [],
    };
  }

  render() {
    return (
      //   <Container>
      //     <Header
      //       style={{backgroundColor: '#1F95CC'}}
      //       androidStatusBarColor="#1F95CC"
      //       noShadow={true}></Header>
      //     <Content>
      <View style={styles.container}>
        <MapView
          // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      </View>
      //     </Content>
      //   </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Location;
