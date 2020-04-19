/* eslint-disable no-undef */
import config from '@/config/environment';

firebase.initializeApp(config.FIREBASE_CONFIG);
const $db = firebase.firestore();
const $auth = firebase.auth();

export { $db, $auth };
