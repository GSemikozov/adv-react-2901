import firebase from 'firebase/app'
import 'firebase/auth'

export const appName = 'adv-react-29-01'

const config = {
  apiKey: 'AIzaSyD3RIBQ59em4ZGOdRLQpS1velxhcgImTeI',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: '832921987414'
}

firebase.initializeApp(config)
