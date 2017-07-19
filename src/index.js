import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBD6zLRah7dnPRL2FpKLLy7gGH6SIrl37c",
  authDomain: "sp-firebase-app.firebaseapp.com",
  databaseURL: "https://sp-firebase-app.firebaseio.com",
  projectId: "sp-firebase-app",
  storageBucket: "sp-firebase-app.appspot.com",
  messagingSenderId: "910951010182"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
