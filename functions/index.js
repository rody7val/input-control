const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp(functions.config().firebase);

exports.welcome = functions.auth.user().onCreate( event => {
	const user = event.data
	user.active = true
	user.admin = false
	user.created = moment().valueOf()
	admin.database().ref('users/' + user.uid).set(user)
})

exports.pushItem = functions.database.ref('/items/{pushId}').onCreate( event => {
	const key = event.params.pushId
	const snapshot = event.data
	const item = snapshot.val()

	Object.keys(item.categories).forEach( category => {
		admin.database()
			.ref(`/categories/${category}/members/${snapshot.key}`)
			.set(true)
			.then(() => {
				console.log('Categories references', snapshot.key);
			})
	})
	Object.keys(item.providers).forEach( provider => {
		admin.database()
			.ref(`/providers/${provider}/members/${snapshot.key}`)
			.set(true)
			.then(() => {
				console.log('Providers references', snapshot.key);
			})
	})
});