const functions = require('firebase-functions')
const admin = require('firebase-admin')
const moment = require('moment')
const mailTransport = require('nodemailer').createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().webmail.email,
    pass: functions.config().webmail.pass
  },
  tls: { 
    rejectUnauthorized: false 
  }
})

admin.initializeApp(functions.config().firebase);

function emailAuth(name, email, subject) {
  return mailTransport.sendMail({
    from: functions.config().webmail.email,
    to: `${email}`,
    subject: `${subject}`,
    html: `<h3>insumax.com<h3><p>Hola <b>${name}</b>! Gracias por registrarte en nuestro sistema.</p>`
  })
}

exports.welcome = functions.auth.user().onCreate( event => {
	const user = event.data
	user.active = true
	user.admin = false
	user.created = moment().valueOf()
	// set user
	const ref = admin.database().ref('users/list/' + user.uid)
	ref.set(user)
	// set count
	ref.parent.on('value', snapshot => {
	  ref.parent.parent.child('count').set(snapshot.numChildren())
	})
	// send email
	emailAuth(user.displayName, user.email, 'insumax.com')
})

exports.pushItem = functions.database.ref('/items/list/{pushId}').onCreate( event => {
	const key = event.params.pushId
	const itemSnapshot = event.data
	const item = itemSnapshot.val()
	// set count
	event.data.ref.parent.once('value', snapshot => {
		const count = snapshot.numChildren();
		console.log(count);
		event.data.ref.parent.parent.child('count').set(count);
	})
	// set categories reference
	Object.keys(item.categories).forEach( category => {
		admin.database()
			.ref(`/categories/list/${category}/members/${itemSnapshot.key}`)
			.set(true)
	})
	// set providers reference
	Object.keys(item.provider).forEach( provider => {
		admin.database()
			.ref(`/providers/list/${provider}/members/${itemSnapshot.key}`)
			.set(true)
	})
});