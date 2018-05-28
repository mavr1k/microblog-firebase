import React, { Component } from 'react';
import FirestoreService from '../FirestoreService';
import Post from './Post';

class Blogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: null,
      users: null,
      message: ''
    };
    this.getAll();
  }

  getAll() {
    this.setState({ blogs: null });
    Promise.all([
      FirestoreService.getBlogs(this.props.db),
      FirestoreService.getUsers(this.props.db)
    ])
      .then(([blogs, users]) => {
        this.setState({ blogs, users });
      });
  }

  findAuthor(email) {
    return this.state.users.find(user => user.email === email);
  }

  handleEnter(e) {
    if (e.key === 'Enter') {
      this.post();
    }
  }

  post() {
    if (this.state.message) {
      FirestoreService.postMessage(this.props.db, this.state.message, this.props.user.email);
      this.setState({ message: '' });
      this.getAll();
    }
  }

  render() {
    const { blogs } = this.state;
    return (
      <div className="blogs">
        <button className="btn btn-outline-secondary btn-sm logout" onClick={() => this.props.onLogout()}>Logout</button>
        <h1>
          <span role="img" aria-label="wave">🌊</span>
          Blogs
          <span role="img" aria-label="wave">🌊</span>
        </h1>
        <div className="post-input input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">What&apos;s new?</span>
          </div>
          <input value={this.state.message} onChange={e => this.setState({ message: e.target.value })} onKeyPress={e => this.handleEnter(e)} className="form-control" type="text" />
          <div className="input-group-append">
            <button onClick={() => this.post()} className="btn btn-outline-secondary" type="button">Post</button>
          </div>
        </div>
        {blogs === null ? <img className="spinner" src="img/loading.gif" /> :
          blogs.map((blog, i) =>
            <Post author={this.findAuthor(blog.author)} post={blog} key={i} />)}
      </div>
    );
  }
}

export default Blogs;
