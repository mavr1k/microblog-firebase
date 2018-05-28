
/* global localStorage firebase */
import React, { Component } from 'react';
import Login from './Login';
import Blogs from './Blogs';
import FirestoreService from '../FirestoreService';

class App extends Component {
  constructor() {
    super();
    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    const user = localStorage.getItem('user');
    this.state = {
      user: user ? JSON.parse(user) : null,
      db
    };
  }

  auth(user) {
    FirestoreService.findUserByEmail(this.state.db, user.email)
      .then((dbUser) => {
        this.setState({ user });
        localStorage.setItem('user', JSON.stringify(user));
        if (!dbUser) {
          FirestoreService.addUser(this.state.db, { ...user });
        }
      });
  }

  logout() {
    localStorage.clear();
    this.setState({ user: null });
  }

  render() {
    return (
      <div className="container">
        {this.state.user ? <Blogs db={this.state.db} onLogout={() => this.logout()} user={this.state.user} /> : <Login onLogin={u => this.auth(u)} />}
      </div>
    );
  }
}

export default App;
