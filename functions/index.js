const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp(functions.config().firebase);

exports.welcome = functions.auth.user().onCreate(event => {
	const user = event.data
	user.active = true
	user.admin = false
	user.created = moment().valueOf()
	admin.database().ref('users/' + user.uid).set(user)
})
