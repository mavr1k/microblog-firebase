/* global document */
import React, { Component } from 'react';
import randomEmoji from 'random-emoji';
import { Redirect } from 'react-router-dom';
import Feed from './Feed';
import FirestoreService from '../FirestoreService';

class Blogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: null,
      message: '',
      emoji: randomEmoji.random({ count: 1 })[0]
    };
  }

  componentDidMount() {
    if (this.props.user !== null) {
      this.getAll();
      this.unsubscribe = FirestoreService
        .onBlogsChange(this.props.db)
        .onSnapshot((snap) => {
          const blogs = snap.docs.map(el => ({ ...el.data(), id: el.id }));
          this.setState({ blogs });
        });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onReply(postId) {
    const input = document.getElementById('message-input');    
    input.scrollIntoView({ behavior: 'smooth', block: 'end' });
    this.setState({ message: `@${postId} ` });
    setTimeout(() => input.focus(), 500);
  }

  getAll() {
    FirestoreService.getUsers(this.props.db).then((users) => {
      this.props.onGetUsers(users);
    });
  }

  findAuthor(email) {
    return this.props.users.find(user => user.email === email);
  }

  handleEnter(e) {
    if (e.key === 'Enter') {
      this.post();
    }
  }

  post() {
    if (this.isMessageValid()) {
      FirestoreService.postMessage(
        this.props.db,
        this.state.message,
        this.findReply(),
        this.props.user.email
      );
      this.setState({ message: '' });
    }
  }

  findReply() {
    const res = this.state.message.match(/@(.{20})/);
    if (res) {
      return res[1];
    }
    return res;
  }

  isMessageValid() {
    return this.state.message.length > 0 && this.state.message.length < 200;
  }

  render() {
    const { emoji } = this.state;
    return this.props.user === null ? <Redirect to="/login" /> : (
      <div className="blogs">
        <button className="btn btn-outline-secondary btn-sm logout" onClick={() => this.props.onLogout()}>Logout</button>
        <h1>{emoji.character}Posts{emoji.character}</h1>
        <div className="post-input input-group error">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">What&apos;s new?</span>
          </div>
          <input id="message-input" placeholder="Your text here..." value={this.state.message} onChange={e => this.setState({ message: e.target.value })} onKeyPress={e => this.handleEnter(e)} className={`form-control ${!this.isMessageValid() && this.state.message.length !== 0 ? 'is-invalid' : ''}`} type="text" />
          <div className="input-group-append">
            <button disabled={!this.isMessageValid()} onClick={() => this.post()} className="btn btn-outline-secondary" type="button">Post</button>
          </div>
        </div>
        <Feed
          onReply={p => this.onReply(p)}
          currentUser={this.props.user}
          db={this.props.db}
          users={this.props.users}
          blogs={this.state.blogs}
        />
      </div>);
  }
}

export default Blogs;
