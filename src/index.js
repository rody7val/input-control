import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import 'moment/locale/es'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
	apiKey: "<REPLACE ME>",
	authDomain: "<REPLACE ME>",
	databaseURL: "<REPLACE ME>",
	projectId: "<REPLACE ME>",
	storageBucket: "<REPLACE ME>",
	messagingSenderId: "<REPLACE ME>"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
