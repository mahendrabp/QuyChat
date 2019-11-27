import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
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
import * as firebase from 'firebase';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      avatar: '',
    };
  }

  componentDidMount() {
    this.getDataProfile();
  }

  async getDataProfile() {
    const userCollection = 'users/' + firebase.auth().currentUser.displayName;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          email: data.val().email,
          username: data.val().username,
          avatar: data.val().avatar,
          status: data.val().status,
        });
      });
  }
  async logout() {
    await firebase.auth().signOut();
    this.props.navigation.replace('Login');
    console.log('Logged out!');
  }

  render() {
    return (
      <Container>
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View style={{flex: 1, paddingVertical: 15, paddingHorizontal: 7}}>
            <Text style={{color: '#ffff', fontSize: 20}}>Profil</Text>
          </View>
        </Header>
        <Content>
          <View style={styles.contentMore}>
            <Grid>
              <Row style={{paddingVertical: 15}}>
                <Col style={{alignItems: 'center'}}>
                  <Thumbnail source={{uri: `${this.state.avatar}`}} />
                </Col>
              </Row>
              <Row>
                <Col style={{alignItems: 'center'}}>
                  <Text style={{color: '#252d39', fontSize: 21}}>
                    {this.state.username}
                  </Text>
                  <Text style={{color: '#63676f', fontSize: 14}}>
                    {this.state.email}
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
          <View style={styles.contentSetting}>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('EditProfile')}>
              <Grid>
                <Row style={{paddingVertical: 10}}>
                  <Col style={{width: '15%'}}>
                    <FontAwesome
                      style={[{color: '#252f4a'}]}
                      size={25}
                      name={'user'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Edit Profile</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Maps')}>
              <Grid>
                <Row style={{ paddingVertical: 10 }}>
                  <Col style={{ width: '15%' }}>
                    <FontAwesome style={[{ color: '#252f4a' }]} size={25} name={'map-marker'} />
                  </Col>
                  <Col>
                    <Text style={{ color: '#252d39' }}>Location</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => this.logout()}>
              <Grid>
                <Row style={{paddingVertical: 10}}>
                  <Col style={{width: '15%'}}>
                    <FontAwesome
                      style={[{color: '#252f4a'}]}
                      size={25}
                      name={'power-off'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Logout</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentMore: {
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  contentSetting: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },
});

export default Logout;
