import React, { Component } from 'react';
import Post from './Post';
import FirestoreService from '../FirestoreService';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: null,
      user: null
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
    const { blogs, user } = this.state;
    return (
      <div>
        {user === null || blogs === null ?
          <img className="spinner" src="/img/loading.gif" /> :
          <div>
            <div className="profile">
              <img src={user.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'} />
              <p>{user.displayName}</p>
            </div>
            {blogs.map((blog, i) => <Post author={user} post={blog} key={i} />)}
          </div>
        }
      </div>
    );
  }
}

export default Profile;
