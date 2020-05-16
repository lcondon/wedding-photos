import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import firebaseConfig from '../firebaseconfig.json';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.database();

export { firebase, storage, db };
