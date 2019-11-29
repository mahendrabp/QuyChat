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
import moment from 'moment';
// import 'moment-timezone';
import 'moment/locale/id';
import {NavigationEvents} from 'react-navigation';

import * as firebase from 'firebase';
// import Geolocation from '@react-native-community/geolocation';

class ListMate extends Component {
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

  async componentDidMount() {
    await this.getDataProfile();
    this.getMates();
  }

  async getMates() {
    await firebase
      .database()
      .ref('users/')
      .on('value', snapshot => {
        const Mates = snapshot.val();
        this.setState({
          mates: Mates,
        });
      });
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
        });
      });
  }

  render() {
    return (
      <Container>
        <NavigationEvents onDidFocus={() => this.getMates()} />
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View style={{flex: 1, paddingVertical: 15, paddingHorizontal: 7}}>
            <Grid>
              <Row>
                <Col>
                  <Text
                    style={{
                      color: '#ffff',
                      fontSize: 20,
                      marginLeft: 15,
                      fontWeight: 'bold',
                      fontFamily: 'Roboto',
                    }}>
                    Status
                  </Text>
                </Col>
                {/* <Col></Col> */}
              </Row>
            </Grid>
          </View>
        </Header>
        <Content>
          <View style={styles.contentChats}>
            <View style={styles.contentStatus}>
              {/* <Text
                style={{
                  paddingHorizontal: 10,
                  color: '#252d39',
                  fontWeight: 'bold',
                }}>
                Profil ku
              </Text> */}
              {/* <List>
                <ListItem avatar>
                  <Left>
                    <Thumbnail source={{uri: `${this.state.avatar}`}} />
                  </Left>
                  <Body style={{marginTop: 10}}>
                    <Text>{this.state.username}</Text>
                    <Text note>{this.state.status}</Text>
                  </Body>
                </ListItem>
              </List> */}
            </View>
            <View style={{paddingVertical: 10}}>
              {Object.keys(this.state.mates)
                .filter(
                  val =>
                    this.state.mates[val].email !== this.state.email &&
                    this.state.mates[val].status !== '' &&
                    this.state.mates[val].status !== null,
                )
                .map(key => {
                  return (
                    <>
                      <List>
                        <ListItem
                          avatar
                          button={true}
                          onPress={() =>
                            this.props.navigation.navigate('ChatRoom', {
                              username: this.state.mates[key].username,
                              email: this.state.mates[key].email,
                              avatar: this.state.mates[key].avatar,
                              name: this.state.mates[key].name,
                            })
                          }>
                          <Left>
                            <Thumbnail
                              source={{
                                uri: `${this.state.mates[key].avatar}`,
                              }}
                            />
                          </Left>
                          <Body style={{marginTop: 7}}>
                            {/* <Text>{this.state.mates[key].username}</Text> */}
                            <Text
                              style={{
                                fontWeight: '700',
                                fontSize: 16,
                                color: '#4C5055',
                              }}>
                              {this.state.mates[key].name}
                            </Text>
                            <Row style={{alignContent: 'space-between'}}>
                              <Col style={{width: 150}}>
                                <Text note>{this.state.mates[key].status}</Text>
                              </Col>
                              <Col style={{flex: 1, alignItems: 'flex-end'}}>
                                <Text note>
                                  {moment(this.state.mates[key].update).fromNow(
                                    true,
                                  )}
                                </Text>
                              </Col>
                            </Row>
                          </Body>
                        </ListItem>
                      </List>
                    </>
                  );
                })}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentChats: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  contentStatus: {
    paddingRight: 10,
  },
});

export default ListMate;
