const functions = require('firebase-functions')

var admin = require('firebase-admin')
var serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url
})

// 함수설정
const db = admin.database()

exports.createUserKo = functions.region('asia-northeast3').auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const userObj = {
    email,
    displayName,
    photoURL,
    level: email === functions.config().admin.email ? 0 : 5
  }
  db.ref('users').child(uid).set(userObj)
})

exports.deleteUserKo = functions.region('asia-northeast3').auth.user().onDelete(async (user) => {
  const { uid } = user
  db.ref('users').child(uid).remove()
})
