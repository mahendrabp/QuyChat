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
import {NavigationEvents} from 'react-navigation';

class Profile extends Component {
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
        <NavigationEvents onWillFocus={() => this.getDataProfile()} />
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
                </Col>
              </Row>
            </Grid>
          </View>
          <View style={styles.contentSetting}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('EditProfile')}>
              <Grid>
                <Row style={{paddingVertical: 10}}>
                  <Col style={{width: '15%'}}>
                    <FontAwesome
                      style={[{color: '#1F95CC'}]}
                      size={25}
                      name={'user'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Edit Profil</Text>
                  </Col>
                </Row>
              </Grid>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.logout()}>
              <Grid>
                <Row style={{paddingVertical: 10}}>
                  <Col style={{width: '15%'}}>
                    <FontAwesome
                      style={[{color: '#1F95CC'}]}
                      size={25}
                      name={'power-off'}
                    />
                  </Col>
                  <Col>
                    <Text style={{color: '#252d39'}}>Keluar</Text>
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
    paddingVertical: 40,
    backgroundColor: '#1F95CC',
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    color: 'white',
  },
  contentSetting: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },
});

export default Profile;
