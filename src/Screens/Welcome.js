// import React, {Component} from 'react';

// import {StyleSheet, View, Text, Image} from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';

// import {Button} from 'native-base';

// export default class SplashScreen extends Component {
//   //   componentDidMount() {
//   //     if (
//   //       AsyncStorage.getItem('Authorization') !== null &&
//   //       AsyncStorage.getItem('Authorization') !== ''
//   //     ) {
//   //       this.props.navigation.replace('MenuTabs');
//   //     } else {
//   //       setTimeout(() => {
//   //         this.props.navigation.navigate('IntroScreen');
//   //       }, 4000);
//   //     }
//   //     setTimeout(() => {
//   //       this.props.navigation.navigate('IntroScreen');
//   //     }, 4000);
//   //   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <View
//           style={{
//             marginBottom: 'auto',
//             marginTop: 40,
//           }}>
//           <Text style={styles.textScreen}>Halo!</Text>
//           <Text style={styles.textScreen2}>Selamat datang di QuyChat</Text>
//         </View>
//         <View>
//           <Image
//             source={require('../Assets/Welcome.png')}
//             style={{width: 325, height: 325, borderRadius: 325 / 2}}
//           />
//         </View>
//         <View
//           style={{
//             marginTop: 'auto',
//             alignItems: 'center',
//             marginBottom: 40,
//           }}>
//           <Text
//             style={{
//               marginTop: 'auto',
//               alignItems: 'center',
//               marginBottom: 20,
//             }}>
//             Klik "Setuju dan Lanjutkan"
//           </Text>
//           <Button
//             block
//             style={styles.btnColor}
//             onPress={() => this.props.navigation.navigate('Login')}>
//             <Text style={styles.textBtn}>SETUJU DAN LANJUTKAN</Text>
//           </Button>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textScreen: {
//     color: '#3076E0',
//     fontSize: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   textScreen2: {
//     fontSize: 25,
//   },
//   btnColor: {
//     backgroundColor: '#3076E0',
//     color: '#ffffff',
//     width: 10000,
//   },
//   textBtn: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Button} from 'native-base';
import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: -20,
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  mainContent: {
    marginTop: -90,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    marginTop: -40,
    marginBottom: 5,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  textScreen: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 22,
  },
  subTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    marginTop: -10,
    marginBottom: 15,
  },
  pagination: {
    backgroundColor: '#1F95CC',
    flex: 1,
  },
});

const slides = [
  {
    key: '1',
    title: 'Hai, Selamat datang di QuyChat',
    text: '',
    image: require('../Assets/animations/9517-welcom.json'),
  },
  {
    key: '2',
    title: 'Saling Bertukar Pesan',
    text: '',
    image: require('../Assets/animations/2442-send.json'),
  },
  {
    key: '3',
    title: 'Cek Keberadaan Sobat Kamu',
    text: '',
    image: require('../Assets/animations/1910-location.json'),
  },
  {
    key: '4',
    title: 'Gratis',
    text: '',
    image: require('../Assets/animations/11504-birthday.json'),
  },
  {
    key: '5',
    title: 'Quy Gabung',
    text: '',
    image: require('../Assets/animations/2628-youre-in.json'),
  },
];

export default class App extends Component {
  goToLogin = () => {
    this.props.navigation.navigate('Login');
  };
  _renderNextButton = () => {
    return <Icon name="chevron-circle-right" size={40} color="white" />;
  };
  _renderDoneButton = () => {
    return (
      <Icon
        name="check-circle"
        size={40}
        color="white"
        onPress={() => this.goToLogin()}
      />
    );
  };
  _renderItem({item, index}) {
    return (
      <View style={styles.mainContent}>
        <Image source={item.image} style={styles.image} />
        <LottieView source={item.image} autoPlay loop />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.pagination}>
        <StatusBar backgroundColor="#1F95CC" barStyle="light-content" />
        <Text style={styles.textScreen}>QuyChat</Text>
        <AppIntroSlider
          style={{backgroundColor: '#1F95CC'}}
          slides={slides}
          renderItem={this._renderItem}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
        />
      </View>
    );
  }
}
