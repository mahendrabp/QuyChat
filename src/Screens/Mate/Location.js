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
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      avatar: '',
      status: '',
      mates: [],
      longitude: '',
      latitude: '',
      initLocation: '',
      currentPostion: '',
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  watchID: ?number = null;

  getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        this.setState({
          initLocation: position,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true},
    );

    this.watchId = Geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          currentPostion: position,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true},
    );
  };

  render() {
    let mateMap;
    return (
      <Container>
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}></Header>

        <MapView
          style={{
            position: 'absolute',
            width: '100%',
            height: '90%',
          }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: this.props.navigation.getParam('latitude'),
              longitude: this.props.navigation.getParam('longitude'),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            title={'test title'}
            description={'test desc'}
          />
        </MapView>
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => this.props.navigation.goBack()}>
            <Icon type="Ionicons" name="md-close" style={{color: '#fff'}} />
          </TouchableOpacity>
        </View>
      </Container>
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
  btnBack: {
    position: 'absolute',
    backgroundColor: '#1F95CC',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
});

export default Location;
