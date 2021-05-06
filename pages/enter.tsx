import { useContext, useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import { auth, firestore, googleAuthProvider } from 'lib/firebase';
import { UserContext } from '@/lib/context';

export const Enter = () => {
  const { user, username } = useContext(UserContext);

  return <main>{user && !username && <UsernameForm />}</main>;
};

const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  );
};

const UsernameForm = () => {
  const [formValue, setFormValue] = useState('');
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to mnatch correct format
    const value = e.target.value.toLowerCase();
    const regExp = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const regExpTest = regExp.test(value);
    // Only set form value if it passes regex

    if (regExpTest) {
      setFormValue(value);
      setLoading(true);
      setValid(false);
    } else {
      setFormValue(value);
      setLoading(false);
      setValid(false);
    }

    checkUsername(value);
  };

  // Hit the database for username match after each debounced change
  // userCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (toCheckName) => {
      if (toCheckName.length >= 3) {
        const ref = firestore.doc(`usernames/${toCheckName}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed');
        setValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="My Name"
            value={formValue}
            onChange={onChange}
            autoComplete="off"
          />
          <UsernameMessage name={formValue} valid={valid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!valid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            username Valid: {valid.toString()}
          </div>
        </form>
      </section>
    )
  );
};

const UsernameMessage = ({ name, valid, loading }) => {
  if (loading) {
    return <p>Checking...</p>;
  } else if (valid) {
    return <p className="text-success">{name} is available</p>;
  } else if (name && !valid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
};

export default Enter;
