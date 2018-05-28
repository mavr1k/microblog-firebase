import React from 'react';

const Post = props => (
  <div className="post row">
    <div className="author col-md-3">
      <div className="photo" style={{ backgroundImage: `url('${props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
      <span>{props.author.displayName}</span>
    </div>
    <div className="text col-md-9">
      <p className="body">{props.post.body}</p>
      <p className="date">{props.post.timeStamp.toDate().toLocaleString()}</p>
    </div>
  </div>
);

export default Post;
