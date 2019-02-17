import 'firebase/auth'
import 'firebase/firestore'

import firebase from 'firebase/app'

class ApiService {
  fb = firebase

  signIn = (email, password) =>
    this.fb.auth().signInWithEmailAndPassword(email, password)
  signUp = (email, password) =>
    this.fb.auth().createUserWithEmailAndPassword(email, password)

  onAuthStateChanged = (callback) => this.fb.auth().onAuthStateChanged(callback)

  fetchAllEvents = () =>
    this.fb
      .firestore()
      .collection('events')
      .get()
      .then((res) => res.docs.map((doc) => doc.data()))

  // TODO: make fetchLazyevents using real fb api
  fetchLazyEvents = (id) =>
    this.fb
      .firestore()
      .collection('events')
      .orderBy('title')
      .startAfter(id ? id : '')
      .limit(10)
      .get()
      .then((res) => res.docs.map((doc) => doc.data()))
}

export default new ApiService()
