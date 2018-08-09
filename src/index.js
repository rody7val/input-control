import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import 'moment/locale/es'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
	apiKey: "AIzaSyCBfWA1dNZ2skNNierb5f-8wQNmR-KLqz0",
	authDomain: "insu-max.firebaseapp.com",
	databaseURL: "https://insu-max.firebaseio.com",
	projectId: "insu-max",
	storageBucket: "insu-max.appspot.com",
	messagingSenderId: "90562965570"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
