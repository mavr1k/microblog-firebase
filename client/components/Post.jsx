/* global window */
import React from 'react';
import { Link } from 'react-router-dom';
import FirestoreService from '../FirestoreService';

const deletePost = (db, id) => {
  if (window.confirm('Are you sure?')) {
    FirestoreService.deleteMessage(db, id);
  }
};

const Post = props => (
  <div className="post row">
    <div className="author col-md-3">
      {window.location.pathname.includes('user') ? (
        <span>
          <div className="photo" style={{ backgroundImage: `url('${props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
          {props.author.displayName}
        </span>
      ) : (
        <Link href="/" to={`/user/${encodeURIComponent(props.author.email)}`}>
          <div className="photo" style={{ backgroundImage: `url('${props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
          {props.author.displayName}
        </Link>
        )}
    </div>
    <div className="text col-md-9">
      <p className="body">{props.post.body}</p>
      <p className="date">{props.post.timeStamp.toDate().toLocaleString()}</p>
      {props.post.author === props.currentUser.email || props.currentUser.isAdmin ?
        <button onClick={() => deletePost(props.db, props.post.id)} className="btn btn-link delete-post">
          <i className="fas fa-eraser" />
        </button> : null}
      <button className="btn btn-link post-id">{props.post.id}</button>
    </div>
  </div>
);

export default Post;
