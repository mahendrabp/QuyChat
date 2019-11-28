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
          initLocation,
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
          ref={ref => (mateMap = ref)}
          style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              latitude: this.props.navigation.getParam('latitude'),
              longitude: this.props.navigation.getParam('longitude'),
            }}
            title={this.props.navigation.getParam('username')}
            description={'lokasi' + this.props.navigation.getParam('username')}
            onPress={() => {
              mateMap.fitToCoordinates(
                [
                  {
                    latitude: this.props.navigation.getParam('latitude'),
                    longitude: this.props.navigation.getParam('longitude'),
                  },
                ],
                {
                  animated: true, // optional
                },
              );
            }}
          />
          <Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title="Aku"
            description="lokasi kamu sekarag disini"
            onPress={() => {
              mateMap.fitToCoordinates(
                [
                  {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  },
                ],
                {
                  animated: true, // optional
                },
              );
            }}
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
