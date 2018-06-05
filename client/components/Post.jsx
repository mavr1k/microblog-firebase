
/* global window document */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FirestoreService from '../FirestoreService';

const scrollTo = (element) => {
  element.scrollIntoView({ behavior: 'smooth' });
  element.classList.toggle('highlight');
  setTimeout(() => element.classList.toggle('highlight'), 2000);
};

const processBody = (text) => {
  const match = text.match(/@(.{20})/);
  let element = null;
  if (match) {
    element = document.getElementById(match[1]);
  }
  if (element) {
    const array = text.split(match[0]);
    return array.map((item, i) => {
      if (i === 0) {
        return (
          <span key={item}>
            <span className="reference-to-post" onClick={() => scrollTo(element)}>{match[0]}</span>
            {item}
          </span>
        );
      }
      return <span key={item}>{item}</span>;
    });
  }
  return text;
};

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: [],
      areRepliesShown: false
    };
  }
  componentDidMount() {
    this.getReplies();
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  getReplies() {
    this.unsubscribe = FirestoreService.onReplyChange(this.props.db, this.props.post.id)
      .onSnapshot((array) => {
        const replies = array.docs.map(el => ({ ...el.data(), id: el.id }));
        this.setState({ replies });
      });
  }
  getLikeIcon() {
    if (this.props.post.likes &&
      Array.isArray(this.props.post.likes) &&
      this.props.post.likes.some(like => like === this.props.currentUser.email)) {
      return <i className="fas fa-heart" />;
    }
    return <i className="far fa-heart" />;
  }
  deletePost(id) {
    if (window.confirm('Are you sure?')) {
      FirestoreService.deleteMessage(this.props.db, id);
    }
  }
  getUsersLikes() {
    if (this.calculateLikes()) {
      return this.props.post.likes.map((like) => {
        const user = this.props.users.find(propsUser => propsUser.email === like);
        return (
          <li className="row" key={user.email}>
            <div className="col-md-4">
              <Link href="/" to={`/user/${encodeURIComponent(user.email)}`}>
                <div className="photo" style={{ backgroundImage: `url('${user.photoURL}')` }} />
              </Link>
            </div>
            <div className="col-md-8">
              <Link href="/" to={`/user/${encodeURIComponent(user.email)}`}>{user.displayName}</Link>
            </div>
          </li>
        );
      });
    }
    return null;
  }
  like() {
    FirestoreService.likePost(this.props.db, this.props.currentUser.email, this.props.post.id);
  }
  calculateLikes() {
    const { likes } = this.props.post;
    if (Array.isArray(likes)) {
      return likes.length > 0 ? likes.length : null;
    }
    return null;
  }
  render() {
    return (
      <div className="post row" id={this.props.post.id}>
        <div className="author col-md-3">
          {window.location.pathname.includes('user') ? (
            <span>
              <div className="photo" style={{ backgroundImage: `url('${this.props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
              {this.props.author.displayName}
            </span>
          ) : (
            <Link href="/" to={`/user/${encodeURIComponent(this.props.author.email)}`}>
              <div className="photo" style={{ backgroundImage: `url('${this.props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
              {this.props.author.displayName}
            </Link>
            )}
        </div>
        <div className="text col-md-9">
          <p className="date">{this.props.post.timeStamp.toDate().toLocaleString()}</p>
          <p className="body">{processBody(this.props.post.body)}</p>
          {this.props.post.author === this.props.currentUser.email
            || this.props.currentUser.isAdmin ?
              <button onClick={() => this.deletePost(this.props.post.id)} className="btn btn-link delete-post">
                <i className="fas fa-eraser" />
              </button> : null}
          {window.location.pathname.includes('user') ? null : <button onClick={() => this.props.onReply(this.props.post.id)} className="btn btn-link reply-to-post"><i className="fas fa-reply" /></button>}
          <div className="buttons">
            <button onClick={() => this.like()} className="btn btn-link like">{this.calculateLikes()} {this.getLikeIcon()}</button>
            {this.calculateLikes() ? (
              <ul className="users-likes">
                {this.getUsersLikes()}
              </ul>
            ) : null}
            {this.props.isReply || !(this.state.replies && this.state.replies.length) ? null :
            <button onClick={() => this.setState({ areRepliesShown: !this.state.areRepliesShown })} className="btn btn-link show-replies-btn">{!this.state.areRepliesShown ?
                `${this.state.replies.length} ${this.state.replies.length > 1 ? 'replies' : 'reply'}` : 'Hide'}
            </button>}
          </div>
        </div>
        {!(this.state.areRepliesShown && this.state.replies) ? null : (
          <div className="replies container" >
            {this.state.replies.map(el => (
              <Post
                isReply
                users={this.props.users}
                onReply={() => this.props.onReply(el.id)}
                currentUser={this.props.currentUser}
                author={this.props.users.find(user => user.email === el.author)}
                post={el}
                db={this.props.db}
                key={el.id}
              />
            ))}
          </div>
        )
        }
      </div>);
  }
}

export default Post;
