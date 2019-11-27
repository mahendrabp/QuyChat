import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Header, Icon} from 'native-base';

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
      latitude: -6.6194727,
      longitude: 106.8241719,
      initLocation: 'n/a',
      currentLocation: 'n/a',
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  watchID: ?number = null;

  async getLocation() {
    await Geolocation.getCurrentPosition(
      position => {
        const initLocation = JSON.stringify(position);
        this.setState({
          initLocation: initLocation,
          // latitude: position.coords.latitude,
          // longitude: position.coords.longitude,
        });
      },
      error => {},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const currentLocation = JSON.stringify(position);
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        currentLocation,
      });
    });
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

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
            height: '100%',
          }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
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
      // <View>
      //   <Text>Initial position:</Text>

      //   <Text>{this.state.initLocation}</Text>

      //   <Text>Current position:</Text>

      //   <Text>{this.state.currentLocation}</Text>
      //   <Text>{this.state.latitude}</Text>
      //   <Text>{this.state.longitude}</Text>
      // </View>
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
