import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Text,
  Grid,
  Col,
  Row,
  Thumbnail,
  Toast,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import * as firebase from 'firebase';
import {NavigationEvents} from 'react-navigation';
import * as firebaseRN from 'firebase';
import {firebase} from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';

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
    const userCollection = 'users/' + firebaseRN.auth().currentUser.displayName;
    await firebaseRN
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

  UploadImage = () => {
    const options = {
      noData: true,
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        const Image = response;
        this.setState({imageName: Image.fileName});
        console.log(response);
        console.log(response.uri);

        Alert.alert(
          'Ganti Avatar',
          `Apalah file ini : ${Image.fileName}, benar?`,
          [
            {text: 'Tidak', style: 'cancel'},
            {text: 'Ya', onPress: () => upload()},
          ],
          {cancelable: false},
        );

        const uname = firebaseRN.auth().currentUser.displayName;

        const upload = () => {
          firebase
            .storage()
            .ref()
            .child(`images/${uname}/${Image.fileName}`)
            .putFile(Image.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                let progess =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                ToastAndroid.show(
                  `Upload is ${progess}% done`,
                  ToastAndroid.SHORT,
                );

                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED:
                    ToastAndroid.show('Upload is paused', ToastAndroid.SHORT);
                    break;
                  case firebase.storage.TaskState.RUNNING:
                    ToastAndroid.show(
                      'Upload is running...',
                      ToastAndroid.SHORT,
                    );
                    break;
                }
              },
              error => {
                switch (error.code) {
                  case 'storage/unauthorized':
                    ToastAndroid.show('Unauthorized', ToastAndroid.SHORT);
                    break;
                  case 'storage/canceled':
                    ToastAndroid.show('Canceled by User', ToastAndroid.SHORT);
                    break;
                  case 'storage/unknown':
                    ToastAndroid.show('Error Unknown', ToastAndroid.SHORT);
                    break;
                }
              },
              () => {
                ToastAndroid.show('Sukses Upload avatar!', ToastAndroid.LONG);

                firebase
                  .storage()
                  .refFromURL(
                    `gs://quychat-bima.appspot.com/images/${uname}/${Image.fileName}`,
                  )
                  .getDownloadURL()
                  .then(url => {
                    firebaseRN
                      .database()
                      .ref(`users/${uname}`)
                      .update({avatar: url});
                  });
              },
            );
        };
      }
    });
  };
  async logout() {
    // await firebaseRN.auth().signOut();
    // this.props.navigation.replace('Login');

    Alert.alert(
      'Keluar',
      'yakin mau keluar?',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => out()},
      ],
      {cancelable: false},
    );

    const out = () => {
      firebaseRN
        .auth()
        .signOut()
        .then(() => {
          Toast.show({
            text: 'Berhasil Logout',
            duration: 800,
          });
          this.props.navigation.replace('Login');
        })
        .catch(err => {
          Toast.show({
            text: err.message,
            type: 'danger',
            duration: 800,
          });
        });
    };
    console.log('Logged out!');
  }

  render() {
    return (
      <Container>
        <NavigationEvents onDidFocus={() => this.getDataProfile()} />
        <Header
          style={{backgroundColor: '#1F95CC'}}
          androidStatusBarColor="#1F95CC"
          noShadow={true}>
          <View
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 7,
              marginLeft: '4%',
            }}>
            <Text style={{color: '#ffff', fontSize: 20, fontWeight: 'bold'}}>
              Profil
            </Text>
          </View>
        </Header>
        <Content>
          <View style={styles.contentProfile}>
            <Grid>
              <Row style={{paddingVertical: 10}}>
                <Col style={{alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => this.UploadImage()}>
                    <Thumbnail large source={{uri: `${this.state.avatar}`}} />
                  </TouchableOpacity>
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
          <View style={styles.contentSet}>
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
  contentProfile: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: -10,
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
  },
});

export default Profile;
