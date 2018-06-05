
/* global localStorage firebase */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Blogs from './Blogs';
import Profile from './Profile';
import Users from './Users';
import FirestoreService from '../FirestoreService';

class App extends Component {
  constructor() {
    super();
    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    let user = localStorage.getItem('user');
    try {
      user = user ? JSON.parse(user) : null;
    } catch (e) {
      user = null;
    }
    this.state = {
      users: null,
      user,
      db
    };
    if (user) {
      FirestoreService.findUserByEmail(this.state.db, user.email)
        .then((dbUser) => {
          if (dbUser) {
            this.setState({ user: dbUser });
          }
        });
    }
  }

  onGetUsers(users) {
    if (users) {
      this.setState({ users });
    } else {
      FirestoreService.getUsers(this.state.db).then(u => this.setState({ users: u }));
    }
  }

  auth(user) {
    FirestoreService.findUserByEmail(this.state.db, user.email)
      .then((dbUser) => {
        localStorage.setItem('user', JSON.stringify(user));
        if (!dbUser) {
          return FirestoreService.addUser(this.state.db, { ...user })
            .then(u => this.setState({ user: u }));
        }
        this.setState({ user: dbUser });
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
          <Route exact path="/" render={() => <Blogs users={this.state.users} onGetUsers={u => this.onGetUsers(u)} db={this.state.db} onLogout={() => this.logout()} user={this.state.user} />} />
          <Route path="/login" render={() => <Login user={this.state.user} onLogin={u => this.auth(u)} />} />
          <Route
            exact
            path="/user/:email"
            render={data => (
              <Profile
                onGetUsers={u => this.onGetUsers(u)}
                users={this.state.users}
                data={data}
                currentUser={this.state.user}
                goBack={data.history.goBack}
                email={data.match.params.email}
                db={this.state.db}
              />
            )}
          />
          { this.state.user && this.state.user.isAdmin ? <Route exact path="/users" render={() => <Users onGetUsers={() => this.onGetUsers()} users={this.state.users} />} /> : null}
        </div>
      </Router>
    );
  }
}

export default App;
