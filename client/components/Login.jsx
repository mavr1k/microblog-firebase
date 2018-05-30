/* global firebase */
import React from 'react';
import { Redirect } from 'react-router-dom';

const login = (cb) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((res) => {
      const user = res.user.providerData[0];
      if (user) {
        cb(user);
      }
    });
};

const Login = ({ onLogin, user }) => (
  <div className="login-form">
    {user === null ? null : <Redirect to="/" />}
    <h2>Login with Google</h2>
    <button className="btn login-btn" onClick={() => login(onLogin)} />
  </div>
);

export default Login;
