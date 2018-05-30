import React, { Component } from 'react';
import randomEmoji from 'random-emoji';
import Feed from './Feed';
import FirestoreService from '../FirestoreService';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: null,
      user: null,
      emoji: randomEmoji.random({ count: 1 })[0]
    };
  }
  componentDidMount() {
    const email = decodeURIComponent(this.props.email);
    Promise.all([
      FirestoreService.getBlogsByEmail(email, this.props.db),
      FirestoreService.findUserByEmail(this.props.db, email)
    ])
      .then(([blogs, user]) => this.setState({ blogs, user }));
  }
  render() {
    const { blogs, user, emoji } = this.state;
    return (
      <div>
        {user === null || blogs === null ?
          <img className="spinner" src="/img/loading.gif" /> :
          <div>
            <button className="btn btn-link go-back" onClick={() => this.props.goBack()}>
              <i className="fas fa-arrow-left" />
            </button>
            <div className="profile">
              <div className="photo" style={{ backgroundImage: `url('${user.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
              <p className="name">{user.displayName}</p>
              <p className="email"><a href={`mailto:${user.email}`}>{user.email}</a></p>
              <p className="posts-count">Posts count: <b>{blogs.length}</b></p>
            </div>
            <h2>{emoji.character}Posts{emoji.character}</h2>
            <Feed users={[this.state.user]} blogs={this.state.blogs} />
          </div>
        }
      </div>
    );
  }
}

export default Profile;
