import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import firebaseConfig from '../../firebaseConfig'
import store from '../store'

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
  store.commit('setUser', user)
})

Vue.prototype.$fire = firebase
