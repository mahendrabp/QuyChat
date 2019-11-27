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

const Width = Dimensions.get('window').width;

class ChatRoom extends Component {
  state = {
    Messages: [],
    name: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    id: '',
  };

  async componentWillMount() {
    await this.setState({
      Messages: [],
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      displayName: this.props.navigation.getParam('username'),
    });
    console.log(firebase.auth().currentUser);
    this.getMessage();
    this.getDatauser();
  }

  userData = () => {
    return {
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      avatar: firebase.auth().currentUser.photoURL,
      // phoneNumber: firebase.auth().currentUser.phoneNumber,
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
    const userCollection = 'users/' + this.state.displayName;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          phoneNumber: data.val().phoneNumber,
          latitude: data.val().latitude,
          longitude: data.val().longitude,
        });
      });
  }

  callPhone() {
    let phoneNumber = `tel:${this.state.phoneNumber}`;
    Linking.openURL(phoneNumber);
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  showMenu = () => {
    this._menu.show();
  };

  _menu = null;

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
                          this.props.navigation.navigate('Location', {
                            username: this.state.displayName,
                            // latitude: this.state.latitude,
                            // longitude: this.state.longitude,
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
                          <MenuItem onPress={this.hideMenu}>Profil</MenuItem>

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

// import React, {Component} from 'react';
// import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
// import {
//   Container,
//   Content,
//   Card,
//   Grid,
//   Item,
//   Input,
//   CardItem,
//   Text,
//   Subtitle,
//   Col,
//   Row,
//   Thumbnail,
//   Header,
//   Left,
//   Body,
//   Right,
//   Button,
//   Icon,
//   Title,
// } from 'native-base';
// import {GiftedChat} from 'react-native-gifted-chat';
// import firebase from 'firebase';

// export default class ChatRoom extends Component {
//   state = {
//     messages: [],
//     newMessage: [],
//     toUser: [],
//     users: [],
//     usernow: [],
//     _id: '',
//     email: '',
//   };

//   componentWillMount() {
//     this.setState({
//       toUser: this.props.navigation.getParam('username'),
//       _id: firebase.auth().currentUser.uid,
//       email: firebase.auth().currentUser.email,
//       messages: [],
//     });

//     this.writeUserData(this);
//     this.getchatData(this);
//   }

//   writeUserData() {
//     var recentPostsRef = firebase.database().ref('/user');
//     recentPostsRef.once('value').then(data => {
//       this.setState({users: data.val()});
//       {
//         Object.keys(this.state.users).map(key => {
//           if (
//             this.state.users[key].email == firebase.auth().currentUser.email
//           ) {
//             this.setState({usernow: this.state.users[key]});
//           }
//         });
//       }
//     });
//   }

//   getchatData() {
//     let messageTo = this.props.navigation.getParam('username');
//     let messagefrom = this.props.navigation.getParam('usersend');
//     var chatRef = firebase
//       .database()
//       .ref('/messages/' + messagefrom + '/' + messageTo);
//     chatRef
//       .once(
//         'value',

//         dataSnapshot => {
//           var messageS = [];

//           dataSnapshot.forEach(child => {
//             messageS = [
//               {
//                 _id: child.key,
//                 text: child.val().text,
//                 createdAt: child.val().createdAt,
//                 user: {
//                   _id: child.val().user.id,
//                   name: child.val().user.name,
//                 },
//               },
//               ...messageS,
//             ];
//           });
//           this.setState({messages: messageS});
//         },
//       )
//       .then(data => {
//         this.setState({users: data.val()});
//       });
//   }

//   onSend(messages = []) {
//     //Pengirim
//     messages.map(data => {
//       let db = firebase.database();
//       let ref = db.ref(
//         'messages/' + this.state.toUser + '/' + this.state.usernow.username,
//       );

//       ref
//         .push({
//           text: data.text,
//           createdAt: new Date().getTime(),
//           user: {
//             id: this.state._id,
//             avatar: '',
//             email: this.state.email,
//             _id: this.state._id,
//             name: this.state.usernow.username,
//           },
//         })
//         .then(data => {
//           console.log('data', data);
//         })
//         .catch(error => {
//           console.log('error', error);
//         });

//       let db2 = firebase.database();
//       let ref2 = db2.ref(
//         'messages/' + this.state.usernow.username + '/' + this.state.toUser,
//       );

//       ref2
//         .push({
//           text: data.text,
//           createdAt: new Date().getTime(),
//           user: {
//             id: this.state._id,
//             avatar: '',
//             email: this.state.email,
//             _id: this.state._id,
//             name: this.state.usernow.username,
//           },
//         })
//         .then(data => {
//           console.log('data', data);
//         })
//         .catch(error => {
//           console.log('error', error);
//         });
//     });

//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }));
//   }

//   render() {
//     var id = this.state._id;
//     return (
//       <Container>
//         <Header style={style.Header}>
//           <Left>
//             <Button transparent>
//               <Icon
//                 style={style.Icon}
//                 name="arrow-back"
//                 onPress={() => this.props.navigation.goBack(null)}
//               />
//             </Button>
//           </Left>
//           <Body>
//             <Text>{this.state.toUser}</Text>
//             <Text note numberOfLines={1}>
//               Online
//             </Text>
//           </Body>
//           <Right>
//             <Button
//               transparent
//               onPress={() => this.props.navigation.goBack(null)}>
//               <Icon type="Entypo" style={style.Icon} name="video-camera" />
//             </Button>
//             <Button
//               transparent
//               onPress={() => this.props.navigation.goBack(null)}>
//               <Icon type="Feather" style={style.Icon} name="phone" />
//             </Button>
//           </Right>
//         </Header>
//         <GiftedChat
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           user={{
//             _id: id,
//           }}
//         />
//       </Container>
//     );
//   }
// }

// const style = StyleSheet.create({
//   Header: {
//     backgroundColor: '#fff',
//   },
//   Container: {
//     backgroundColor: '#dff9fb',
//   },
//   Header: {
//     backgroundColor: '#ffff',
//   },
//   Content: {
//     padding: '2%',
//   },
//   Font: {
//     color: '#95afc0',
//   },
//   Chat: {
//     width: '70%',
//     elevation: 1,
//   },
//   ChatItemLeft: {
//     backgroundColor: '#00a8ff',
//     justifyContent: 'flex-start',
//   },
//   ChatItemRight: {
//     backgroundColor: '#00a8ff',
//     justifyContent: 'center',
//   },
//   Text: {
//     color: '#f5f6fa',
//   },
//   Icon: {
//     color: '#686de0',
//   },
//   Thumbnail: {
//     borderRadius: 50,
//     width: 40,
//     height: 40,
//   },
// });
