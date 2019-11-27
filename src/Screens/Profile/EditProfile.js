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
  Item,
  Label,
  Input,
  Toast,
  Button,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as firebase from 'firebase';
import {SkypeIndicator} from 'react-native-indicators';
import ImagePicker from 'react-native-image-picker';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      phoneNumber: '',
      status: '',
      name: '',
      isLoading: false,
      imageName: '',
    };
  }

  async componentDidMount() {
    await this.getUserData();
  }

  async getUserData() {
    const userCollection = 'users/' + firebase.auth().currentUser.displayName;
    await firebase
      .database()
      .ref(userCollection)
      .once('value', data => {
        this.setState({
          username: data.val().username,
          phoneNumber: data.val().phoneNumber,
          status: data.val().status,
          name: data.val().name,
          avatar: data.val().avatar,
        });
      });
  }

  //   getImage = async () => {
  //     const userCollection = 'users/' + firebase.auth().currentUser.displayName;
  //     await firebase
  //       .database()
  //       .ref(userCollection)
  //       .on('value', snapshot => {
  //         this.setState({});
  //       });
  //   };

  async updateProfile() {
    this.setState({
      isLoading: true,
    });

    const userCollection = 'users/' + firebase.auth().currentUser.displayName;
    await firebase
      .database()
      .ref(userCollection)
      .update({
        status: this.state.status,
        phoneNumber: this.state.phoneNumber,
        username: this.state.username,
        name: this.state.name,
      });
    this.setState({
      isLoading: false,
    });
    Toast.show({
      text: 'Akun QuyChat berhasil dibuat',
      buttonText: 'Ok',
      type: 'success',
      duration: 2000,
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

        Alert.alert(
          'Edit Image',
          `Is this image: ${Image.fileName}, you want to upload?`,
          [
            {text: 'No', style: 'cancel'},
            {text: 'Yes', onPress: () => upload()},
          ],
          {cancelable: false},
        );

        const uid = firebase.auth().currentUser.displayName;

        const upload = () => {
          firebase
            .storage()
            .ref()
            .child(`images/${uid}/${Image.fileName}`)
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
                ToastAndroid.show('Upload Successfully!', ToastAndroid.LONG);
                firebase
                  .storage()
                  .refFromURL(
                    `gs://quychat-bima.appspot.com/images/${uid}/${Image.fileName}`,
                  )
                  .getDownloadURL()
                  .then(url => {
                    firebase
                      .database()
                      .ref(`users/${uid}`)
                      .update({avatar: url});
                  });
              },
            );
        };
      }
    });
  };

  __renderButtonEditProfile() {
    if (this.state.isLoading) {
      return (
        <>
          <SkypeIndicator color="#3C82FF" />
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.btnEditProfile}
          onPress={() => this.updateProfile()}>
          <Text style={{color: '#ffff', fontSize: 18}}>Edit Profil</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <Container>
        {console.log(this.state.phoneNumber)}
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
                    Edit Profil
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
        </Header>
        <Content>
          <View style={styles.contentEditProfile}>
            <Item regular>
              <Input
                disabled
                style={{color: '#252d39'}}
                placeholder={'Username'}
                value={this.state.username}
                onChangeText={val => this.setState({username: val})}
              />
            </Item>
            <Item regular>
              <Input
                style={{color: '#252d39'}}
                placeholder={'Nama kamu'}
                value={this.state.name}
                onChangeText={val => this.setState({name: val})}
              />
            </Item>
            <Item regular>
              <Input
                style={{color: '#252d39'}}
                placeholder={'Telepon kamu'}
                value={this.state.phoneNumber}
                onChangeText={val => this.setState({phoneNumber: val})}
              />
            </Item>
            <Item regular style={{marginTop: 10}}>
              <Input
                style={{color: '#252d39'}}
                placeholder={'update Status mu'}
                value={this.state.status}
                onChangeText={val => this.setState({status: val})}
              />
            </Item>
            <View style={{paddingVertical: 5}}>
              <Button
                style={{
                  justifyContent: 'center',
                  backgroundColor: '#2c2f33',
                  paddingVertical: 10,
                  elevation: 0,
                  height: 60,
                  borderWidth: 0.5,
                  borderColor: 'gray',
                }}
                onPress={() => this.UploadImage()}>
                <Text>Edit Profile Picture</Text>
              </Button>
            </View>
            {this.__renderButtonEditProfile()}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentEditProfile: {
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  btnEditProfile: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#3076E0',
    elevation: 3,
  },
});

export default EditProfile;
