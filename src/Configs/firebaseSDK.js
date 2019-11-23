import firebase from 'firebase';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyDFGvksTN7eLHLpG4DfHQhnnzhwoMNc5Ls',
        authDomain: 'quychat-bima.firebaseapp.com',
        databaseURL: 'https://quychat-bima.firebaseio.com',
        projectId: 'quychat-bima',
        storageBucket: 'quychat-bima.appspot.com',
        messagingSenderId: '633612731220',
        appId: '1:633612731220:web:77c85853c0f71ef2107ec1',
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
