import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Grid,
  Col,
  Row,
  Thumbnail,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';
import MapView, {Marker} from 'react-native-maps';
import {SkypeIndicator} from 'react-native-indicators';
class MateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      avatar: '',
      phoneNumber: '',
    };
  }

  async componentDidMount() {
    await this.getUserData();
    this.getPhoneNumber();
  }

  async getUserData() {
    await this.setState({
      username: this.props.navigation.getParam('username'),
      email: this.props.navigation.getParam('email'),
      avatar: this.props.navigation.getParam('avatar'),
      latitude: this.props.navigation.getParam('latitude'),
      longitude: this.props.navigation.getParam('longitude'),
    });
  }

  async getPhoneNumber() {
    const userCollection = 'users/' + this.state.username;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          phoneNumber: data.val().phoneNumber,
        });
      });
    console.log(this.state.phoneNumber);
  }

  _renderMap = () => {
    let mateMap;
    if (this.state.latitude === null || this.state.latitude === '') {
      return <SkypeIndicator color="#3C82FF" />;
    } else {
      return (
        <>
          <MapView
            ref={ref => (mateMap = ref)}
            style={{
              width: 400,
              height: 250,
              marginLeft: 20,
              borderTopLeftRadius: 55,
              borderTopRightRadius: 55,
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
              }}
              title={this.props.navigation.getParam('username')}
              description={
                'lokasi' + this.props.navigation.getParam('username')
              }
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
          </MapView>
        </>
      );
    }
  };

  callPhone() {
    let phoneNumber = `tel:${this.state.phoneNumber}`;
    Linking.openURL(phoneNumber);
  }

  render() {
    return (
      <Container>
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View style={{flex: 1, paddingVertical: 15, paddingHorizontal: 7}}>
            <Grid>
              <Row>
                <Col style={{width: '10%'}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <FontAwesome
                      style={[{color: '#ffff'}]}
                      size={25}
                      name={'angle-left'}
                    />
                  </TouchableOpacity>
                </Col>
                <Col>
                  <Text style={{color: '#ffff', fontSize: 20}}>
                    {`Profil ${this.props.navigation.getParam('username')}`}
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
        </Header>
        <Content>
          <View style={styles.content}>
            <Grid>
              <Row style={{paddingVertical: 5}}>
                <Col style={{alignItems: 'center'}}>
                  <Thumbnail large source={{uri: `${this.state.avatar}`}} />
                </Col>
              </Row>
              <Row>
                <Col style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 21,
                      fontWeight: 'bold',
                    }}>
                    {this.state.username}
                  </Text>
                  <Text style={{color: '#ffffff', fontSize: 14}}>
                    {this.state.email.toLowerCase()}
                  </Text>
                  <Text style={{color: '#f8f8f8', fontSize: 12}}>
                    {this.state.phoneNumber}
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
          <View style={styles.contentSet}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ChatRoom', {
                  username: this.state.username,
                })
              }>
              <Grid style={{marginTop: 20}}>
                <Row style={{paddingVertical: 10}}>
                  <Col
                    style={{
                      width: '10%',
                      marginRight: 10,
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      style={[{color: '#1F95CC'}]}
                      size={25}
                      name={'chat-processing'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Obrolan</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.callPhone()}>
              <Grid>
                <Row style={{paddingVertical: 10}}>
                  <Col
                    style={{
                      width: '10%',
                      marginRight: 10,
                      alignItems: 'center',
                    }}>
                    <FontAwesome
                      style={[{color: '#1F95CC'}]}
                      size={25}
                      name={'phone'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Telepon</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>
          </View>
        </Content>
        <View
          style={{
            marginTop: 10,
            alignItems: 'center',
            borderTopColor: '#1F95CC',
            borderTopWidth: 2,
          }}>
          {/* <MapView
            style={{
              width: 400,
              height: 250,
              marginLeft: 20,
              borderTopLeftRadius: 55,
              borderTopRightRadius: 55,
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
              title={this.state.username + ' ada disini nih'}
              // description={'test desc'}
            />
          </MapView> */}
          {this._renderMap()}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#1F95CC',
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    color: 'white',
  },
  contentSet: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 7,
    // backgroundColor: 'red',
  },
  contentMap: {
    marginTop: '5%',
    paddingHorizontal: 25,
    paddingVertical: '35%',
    position: 'relative',
  },
});

export default MateProfile;
