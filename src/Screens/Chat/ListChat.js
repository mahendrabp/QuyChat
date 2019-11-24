import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
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
  List,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Right,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

class ListChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      status: '',
      phone: '',
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
    this.setState({
      username: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
    });
    await firebase
      .database()
      .ref('users/')
      .on('value', snapshot => {
        const set = snapshot.val();
        this.setState({
          users: set,
        });
      });
  }

  componentDidMount() {
    this.getData();
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
                      name="menu"
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
                placeholder="cari percakapan"
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
              .filter(val => this.state.users[val].email !== this.state.email)
              .map(key => {
                return (
                  <>
                    <List>
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
                          <Thumbnail
                            source={{uri: `${this.state.users[key].avatar}`}}
                          />
                        </Left>
                        <Body>
                          <Text>{this.state.users[key].username}</Text>
                          {/* <Text note>{this.state.users[key].email}</Text> */}
                          <Text note>{this.state.users[key].status}.</Text>
                        </Body>
                        <Right style={{justifyContent: 'center'}}>
                          {/* <Text note>{item.date}</Text> */}
                        </Right>
                      </ListItem>
                    </List>
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
  },
});

export default ListChat;
