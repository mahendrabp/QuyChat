import React, {Component, Children} from 'react';
import {View, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {Container, Header, Grid, Col, Row, Text} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GiftedChat} from 'react-native-gifted-chat';
import * as firebase from 'firebase';

class ChatRoom extends React.Component {
  state = {
    messages: [],
    name: '',
    displayName: '',
    email: '',
    phone: '',
  };

  async componentWillMount() {
    await this.setState({
      messages: [],
      name: firebase.auth().currentUser.displayName,
      displayName: this.props.navigation.getParam('username'),
    });
    this.getMessage();
    this.getDatauser();
  }

  userData = () => {
    return {
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      avatar: firebase.auth().currentUser.photoURL,
      _id: firebase.auth().currentUser.uid,
    };
  };

  onSend = async messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {
        text,
        user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
      await firebase
        .database()
        .ref(`Messages/${this.state.name}/${this.state.displayName}`)
        .push(message);
      await firebase
        .database()
        .ref(`Messages/${this.state.displayName}/${this.state.name}`)
        .push(message);
    }
  };

  getMessage() {
    firebase
      .database()
      .ref(
        'Messages/' +
          firebase.auth().currentUser.displayName +
          '/' +
          this.props.navigation.getParam('username') +
          '/',
      )
      .on('value', snapshot => {
        let data = [];
        snapshot.forEach(child => {
          data = [
            {
              _id: child.key,
              text: child.val().text,
              createdAt: child.val().createdAt,
              user: {
                _id: child.val().user._id,
                name: child.val().user.name,
              },
            },
            ...data,
          ];
        });
        this.setState({Messages: data});
      });
  }

  async getDatauser() {
    const userCollection = 'users/' + this.state.phone;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          phone: data.val().phone,
        });
      });
  }

  callPhone() {
    let phone = `tel:${this.state.phone}`;
    Linking.openURL(phone);
  }

  render() {
    return (
      <Container>
        <Header
          style={{backgroundColor: '#252f4a'}}
          androidStatusBarColor="#202a43"
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
                    {this.state.displayName}
                  </Text>
                </Col>
                <Col>
                  <Row>
                    <Col style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity onPress={() => this.callPhone()}>
                        <FontAwesome
                          style={[{color: '#ffff'}]}
                          size={25}
                          name={'phone'}
                        />
                      </TouchableOpacity>
                    </Col>
                    <Col style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Maps', {
                            username: this.state.displayName,
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                          })
                        }>
                        <FontAwesome
                          style={[{color: '#ffff'}]}
                          size={25}
                          name={'map-marker'}
                        />
                      </TouchableOpacity>
                    </Col>
                    <Col
                      style={{
                        width: '30%',
                        alignItems: 'flex-end',
                        marginRight: 5,
                      }}>
                      <TouchableOpacity onPress={() => alert('Down!')}>
                        <FontAwesome
                          style={[{color: '#ffff'}]}
                          size={25}
                          name={'angle-down'}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </View>
        </Header>
        <GiftedChat
          messages={this.state.Messages}
          onSend={Messages => this.onSend(Messages)}
          user={this.userData()}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentChatRoom: {
    flex: 1,
    backgroundColor: '#eff3f6',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});

export default ChatRoom;
