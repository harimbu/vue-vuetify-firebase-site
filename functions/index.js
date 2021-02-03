const functions = require('firebase-functions')

var admin = require('firebase-admin')
var serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url
})

// 함수설정
const db = admin.database()
const fdb = admin.firestore()

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

exports.incrementBoardCount = functions.region('asia-northeast3').firestore.document('boards/{bid}').onCreate(async (snap, context) => {
  try {
    await fdb.collection('meta').doc('boards').update('count', admin.firestore.FieldValue.increment(1))
  } catch (e) {
    await fdb.collection('meta').doc('boards').set({ count: 1 })
  }
})

exports.decrementBoardCount = functions.region('asia-northeast3').firestore.document('boards/{bid}').onDelete(async (snap, context) => {
  await fdb.collection('meta').doc('boards').update('count', admin.firestore.FieldValue.increment(-1))
})
