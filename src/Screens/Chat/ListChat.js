import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Container,
  Header,
  Content,
  Icon,
  Text,
  Grid,
  Col,
  Row,
  Input,
  Item,
} from 'native-base';
import * as firebase from 'firebase';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {Avatar, Divider, TouchableRipple, Badge} from 'react-native-paper';

class ListChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      status: '',
      phoneNumber: '',
      avatar: '',
      latitude: '',
      longitude: '',
      users: [],
      text: '',
      search: '',
    };
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

  async getData() {
    // console.log(firebase.auth().currentUser);
    this.setState({
      username: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
    });
    await firebase
      .database()
      .ref('users/')
      .on('value', snapshot => {
        const set = snapshot.val();
        // console.log(set);
        this.setState({
          users: set,
        });
      });
  }

  async getMessage(key) {
    await firebase
      .database()
      .ref(
        'Messages/' +
          firebase.auth().currentUser.displayName +
          '/' +
          this.state.users[key].username +
          '/',
      )
      .limitToLast(1)
      .on('value', snapshot => {
        let text = '';
        snapshot.forEach(child => {
          text = child.val().text;
          // console.log(text);
        });
        this.setState({
          text: text,
        });
      });
  }

  componentDidMount() {
    this.getData();
    // console.log(this.state.users);
  }

  render() {
    return (
      <Container style={{backgroundColor: '#1F95CC'}}>
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View style={{flex: 1, paddingTop: 15, borderRadius: 1000}}>
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
                    QuyChat
                  </Text>
                </Col>
                <Menu
                  ref={this.setMenuRef}
                  button={
                    <Icon
                      active
                      name="md-more"
                      style={{color: '#FFFFFF', marginRight: 15}}
                      onPress={this.showMenu}
                    />
                  }>
                  <MenuItem
                    onPress={() => {
                      this.hideMenu();
                      this.props.navigation.navigate('Other');
                    }}>
                    Grup Baru
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onPress={() => {
                      this.hideMenu();
                      this.props.navigation.navigate('Other');
                    }}>
                    Pengaturan
                  </MenuItem>
                </Menu>
              </Row>
            </Grid>
          </View>
        </Header>
        <Content
          style={{
            // height: 100,
            backgroundColor: 'white',
            borderTopLeftRadius: 180,
          }}>
          <View style={styles.contentSearch}>
            <Item
              style={{
                backgroundColor: '#40A4D3',
                borderRadius: 100,
                borderColor: 'transparent',
              }}>
              <Input
                placeholder="cari percakapan..."
                placeholderTextColor="#FFFFFF"
                style={{color: '#FFFFFF', height: 40, marginLeft: 15}}
                onChangeText={text => this.setState({search: text})}
              />
              <Icon
                active
                name="search"
                style={{color: '#FFFFFF', marginRight: 15}}
              />
            </Item>
          </View>
          <View style={styles.contentChats}>
            {Object.keys(this.state.users)
              .filter(
                this.state.search === ''
                  ? val =>
                      this.state.users[val].email.toLowerCase() !==
                      this.state.email
                  : val =>
                      this.state.users[val].email.toLowerCase() !==
                        this.state.email &&
                      this.state.users[val].username.includes(
                        this.state.search,
                      ),
              )
              .map(key => {
                // console.log(key);
                return (
                  <>
                    <View key={this.state.users[key]}>
                      <TouchableRipple
                        rippleColor="#1F95CC"
                        key={this.state.users[key]}
                        onPress={() =>
                          this.props.navigation.navigate('ChatRoom', {
                            username: this.state.users[key].username,
                            name: this.state.users[key].name,
                            latitude: this.state.users[key].latitude,
                            longitude: this.state.users[key].longitude,
                          })
                        }
                        style={styles.touchable}>
                        <Grid
                          style={{
                            marginBottom: 10,
                            marginTop: 10,
                          }}>
                          <Col size={1}>
                            <View
                              style={{
                                backgroundColor: '#bcbdc6',
                                marginRight: 18,
                                borderRadius: 20,
                                borderColor: '#ffffff',
                              }}>
                              <Avatar.Image
                                size={48}
                                source={{
                                  uri: `${this.state.users[key].avatar}`,
                                }}
                              />
                            </View>
                          </Col>
                          <Col size={3}>
                            <Text style={styles.name}>
                              {/* {this.state.users[key].username} */}
                              {this.state.users[key].name}
                            </Text>
                            <Text style={{fontSize: 16, color: '#bcbdc6'}}>
                              {this.state.users[key].email.toLowerCase()}
                            </Text>
                            {/* {this.getMessage(key)} */}
                            {/* <Text>{this.state.text}</Text> */}
                          </Col>
                          <Col size={1}>
                            <Row style={{alignItems: 'center'}}>
                              <Col style={{alignItems: 'center'}}>
                                <Badge
                                  size={25}
                                  style={{backgroundColor: 'green'}}>
                                  online
                                </Badge>
                              </Col>
                            </Row>
                          </Col>
                        </Grid>
                      </TouchableRipple>
                      <Divider style={styles.divider} />
                    </View>
                  </>
                );
              })}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentSearch: {
    backgroundColor: '#1F95CC',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  contentChats: {
    display: 'flex',
    paddingHorizontal: 5,
    paddingVertical: 5,
    // backgroundColor: '#242A31',
    // borderTopStartRadius: 50,
    marginTop: '1%',
  },
  touchable: {paddingHorizontal: 10, paddingVertical: 2},
  item: {flex: 1, flexDirection: 'row', height: 70, alignItems: 'center'},
  main: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  desp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  name: {fontWeight: '700', fontSize: 18, color: '#4C5055'},
  time: {fontSize: 14, color: 'grey'},
  msg: {fontWeight: '400', fontSize: 14, color: 'grey'},
  divider: {marginLeft: 65, backgroundColor: '#4C5055'},
});

export default ListChat;
