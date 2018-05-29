
/* global localStorage firebase */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Blogs from './Blogs';
import Profile from './Profile';
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
          return FirestoreService.addUser(this.state.db, { ...user });
        }
        return null;
      });
  }

  logout() {
    localStorage.clear();
    this.setState({ user: null });
  }

  render() {
    return (
      <Router>
        <div className="container">
          {this.state.user === null ? <Redirect to={{ pathname: '/login' }} /> : null}
          <Route exact path="/" render={() => <Blogs db={this.state.db} onLogout={() => this.logout()} user={this.state.user} />} />
          <Route path="/login" render={() => <Login user={this.state.user} onLogin={u => this.auth(u)} />} />
          <Route exact path="/user/:email" render={data => <Profile email={data.match.params.email} db={this.state.db} />} />
        </div>
      </Router>
    );
  }
}

export default App;
