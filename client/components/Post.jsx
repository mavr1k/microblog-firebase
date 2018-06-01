
/* global window */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FirestoreService from '../FirestoreService';

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
  deletePost(id) {
    if (window.confirm('Are you sure?')) {
      FirestoreService.deleteMessage(this.props.db, id);
    }
  }
  render() {
    return (
      <div className="post row">
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
          <p className="body">{this.props.post.body}</p>
          <p className="date">{this.props.post.timeStamp.toDate().toLocaleString()}</p>
          {this.props.post.author === this.props.currentUser.email
            || this.props.currentUser.isAdmin ?
              <button onClick={() => this.deletePost(this.props.post.id)} className="btn btn-link delete-post">
                <i className="fas fa-eraser" />
              </button> : null}
          <button onClick={() => this.props.onReply(this.props.post.id)} className="btn btn-link post-id">{this.props.post.id}</button>
          {this.props.isReply || !(this.state.replies && this.state.replies.length) ? null :
          <button onClick={() => this.setState({ areRepliesShown: !this.state.areRepliesShown })} className="btn btn-link show-replies-btn">{!this.state.areRepliesShown ?
              `${this.state.replies.length} ${this.state.replies.length > 1 ? 'replies' : 'reply'}` : 'Hide'}
          </button>}
        </div>
        <div className="replies container" >
          {!(this.state.areRepliesShown && this.state.replies) ? null :
            this.state.replies.map(el => (
              <Post
                isReply
                onReply={() => this.props.onReply(el.id)}
                currentUser={this.props.currentUser}
                author={this.props.users.find(user => user.email === el.author)}
                post={el}
                db={this.props.db}
                key={el.id}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default Post;
