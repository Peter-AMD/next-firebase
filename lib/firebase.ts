import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBWt6phM0S2ds_MAMI-CHfKDU0Q5_NYq9I',
  authDomain: 'nextfire-a163c.firebaseapp.com',
  projectId: 'nextfire-a163c',
  storageBucket: 'nextfire-a163c.appspot.com',
  messagingSenderId: '166034086742',
  appId: '1:166034086742:web:23fbe077ee81d6784054f7',
  measurementId: 'G-ZS4SDKG42F',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth: firebase.auth.Auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export const getUserWithUsername = async (username) => {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];

  return userDoc;
};

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export const postToJSON = (doc) => {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
};
