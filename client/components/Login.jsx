/* global firebase */
import React from 'react';

const login = (cb) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((res) => {
      const user = res.user.providerData[0];
      if (user) {
        cb(user);
      }
    })
    .catch(console.error);
};

const Login = ({ onLogin }) => (
  <div className="login-form">
    <h2>Login with Google</h2>
    <button className="btn login-btn" onClick={() => login(onLogin)} />
  </div>
);

export default Login;
