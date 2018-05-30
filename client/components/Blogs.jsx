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
      users: null,
      message: '',
      emoji: randomEmoji.random({ count: 1 })[0]
    };
  }

  componentDidMount() {
    this.getAll();
    this.unsubscribe = FirestoreService
      .onBlogsChange(this.props.db)
      .onSnapshot(snap =>
        this.setState({ blogs: snap.docs.map(el => ({ ...el.data(), id: el.id })) }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getAll() {
    FirestoreService.getUsers(this.props.db).then(users => this.setState({ users }));
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
    if (this.isMessageValid()) {
      FirestoreService.postMessage(this.props.db, this.state.message, this.props.user.email);
      this.setState({ message: '' });
    }
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
          <input placeholder="Your text here..." value={this.state.message} onChange={e => this.setState({ message: e.target.value })} onKeyPress={e => this.handleEnter(e)} className={`form-control ${!this.isMessageValid() && this.state.message.length !== 0 ? 'is-invalid' : ''}`} type="text" />
          <div className="input-group-append">
            <button disabled={!this.isMessageValid()} onClick={() => this.post()} className="btn btn-outline-secondary" type="button">Post</button>
          </div>
        </div>
        <Feed
          currentUser={this.props.user}
          db={this.props.db}
          users={this.state.users}
          blogs={this.state.blogs}
        />
      </div>);
  }
}

export default Blogs;
