import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import {Container, Header, Grid, Col, Row, Text, Icon} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

// const Width = Dimensions.get('window').width;

class ChatRoom extends Component {
  state = {
    Messages: [],
    name: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    id: '',
    emailUser: '',
    avatarUser: '',
    status: '',
  };

  async componentWillMount() {
    await this.setState({
      Messages: [],
      name: firebase.auth().currentUser.displayName.replace(/ /g, '_'),
      email: firebase.auth().currentUser.email,
      displayName: this.props.navigation.getParam('username'),
    });
    console.log(firebase.auth().currentUser);
    this.getMessage();
    this.getDatauser();
  }

  //get our data from login with email password firebase
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

      //onSend = push to database with message variable
      //https://github.com/FaridSafi/react-native-gifted-chat/issues/1013
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
      //if we want get message from login user to receiver
      //kita sebagai currentUser yang login
      .ref(
        'Messages/' +
          firebase.auth().currentUser.displayName +
          '/' +
          this.props.navigation.getParam('username') +
          '/',
      )
      //value itu mengambil semua value snapshot
      .on('value', snapshot => {
        let data = [];
        snapshot.forEach(child => {
          console.log(child.val());
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
            //spread operator, jika ini dihapus, maka pesan akan munncul hanya satu
            ...data,
          ];
        });
        this.setState({Messages: data});
        // console.log(data);
      });
  }

  async getDatauser() {
    //get user lain/tujuan
    const userCollection = 'users/' + this.state.displayName;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          phoneNumber: data.val().phoneNumber,
          latitude: data.val().latitude,
          longitude: data.val().longitude,
          emailUser: data.val().email,
          avatarUser: data.val().avatar,
          status: data.val().status,
        });
      });
  }

  callPhone() {
    let phoneNumber = `tel:${this.state.phoneNumber}`;
    Linking.openURL(phoneNumber);
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  customBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#1F95CC',
            borderColor: 'white',
            borderWidth: 0.3,
            padding: 5,

            // maxWidth: Width / 2,
          },
          left: {
            backgroundColor: '#F8F8F8',
            borderColor: 'white',
            borderWidth: 0.3,
            padding: 5,
            // maxWidth: Width / 2,
          },
        }}
      />
    );
  };

  customInput = props => {
    return (
      <InputToolbar
        {...props}
        textInputStyle={{color: '#BFBFBF'}}
        containerStyle={{
          backgroundColor: 'white',
          border: '#F8F8F8',
        }}
      />
    );
  };

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{marginRight: 10, marginBottom: 10}}>
          <Icon style={[{color: '#1F95CC'}]} size={25} name={'md-send'} />
        </View>
      </Send>
    );
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
                    {/* {this.state.displayName} */}
                    {this.props.navigation.getParam('name').substring(0, 10)}
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
                          this.props.navigation.navigate('Location', {
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
                      <TouchableOpacity>
                        <Menu
                          ref={this.setMenuRef}
                          button={
                            <FontAwesome
                              style={[{color: '#ffff'}]}
                              size={25}
                              name={'angle-down'}
                              onPress={this.showMenu}
                            />
                          }>
                          <MenuItem
                            onPress={() => {
                              this.hideMenu();
                              this.props.navigation.navigate('MateProfile', {
                                username: this.state.displayName,
                                email: this.state.emailUser,
                                avatar: this.state.avatarUser,
                                status: this.state.status,
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                              });
                            }}>
                            Profil
                          </MenuItem>

                          <MenuDivider />
                          <MenuItem onPress={this.hideMenu}>
                            Diamkan Notifikasi
                          </MenuItem>
                        </Menu>
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
          placeholder={'Ketik pesan...'}
          renderBubble={this.customBubble}
          renderSend={this.renderSend}
          renderAvatar={null}
        />
      </Container>
    );
  }
}

export default ChatRoom;
