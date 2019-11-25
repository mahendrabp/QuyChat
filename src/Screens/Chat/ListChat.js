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
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {Avatar, Divider, TouchableRipple} from 'react-native-paper';

class ListChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      status: '',
      phoneNumber: '',
      avatar: '',
      users: [],
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
    console.log(firebase.auth().currentUser);
    this.setState({
      username: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
    });
    await firebase
      .database()
      .ref('users/')
      .on('value', snapshot => {
        const set = snapshot.val();
        console.log(set);
        this.setState({
          users: set,
        });
      });
  }

  componentDidMount() {
    this.getData();
    console.log(this.state.users);
  }
  render() {
    return (
      <Container>
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View style={{flex: 1, paddingTop: 15}}>
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
                  <MenuItem onPress={this.hideMenu}>Grup Baru</MenuItem>

                  <MenuDivider />
                  <MenuItem onPress={this.hideMenu}>Pengaturan</MenuItem>
                </Menu>
              </Row>
            </Grid>
          </View>
        </Header>
        <Content>
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
                val =>
                  this.state.users[val].email.toLowerCase() !==
                  this.state.email,
              )
              .map(key => {
                return (
                  <>
                    <View>
                      <TouchableRipple
                        key={this.state.users[key].username}
                        onPress={() =>
                          this.props.navigation.navigate('ChatRoom', {
                            username: this.state.users[key].username,
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
                              {this.state.users[key].username}
                            </Text>
                          </Col>
                          <Col size={1}>
                            <Row style={{alignItems: 'center'}}>
                              <Col style={{alignItems: 'center'}}>
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: '#bcbdc6',
                                  }}>
                                  waktu
                                </Text>
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
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // backgroundColor: '#242A31',
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
  divider: {marginLeft: 65, backgroundColor: '#4C5055', height: 1},
});

export default ListChat;

{
  /* <List>
  <ListItem
    avatar
    noBorder
    button={true}
    onPress={() =>
      this.props.navigation.navigate('ChatRoom', {
        username: this.state.users[key].username,
      })
    }>
    <Left>
      <Thumbnail source={{uri: `${this.state.users[key].avatar}`}} />
    </Left>
    <Body>
      <Text>{this.state.users[key].username}</Text>
      <Text note>{this.state.users[key].email}</Text>
      <Text note>{this.state.users[key].status}.</Text>
    </Body>
    <Right style={{justifyContent: 'center'}}>
      <Text note>{item.date}</Text>
    </Right>
  </ListItem>
</List> */
}
