import React from 'react';
import { Link } from 'react-router-dom';

const Post = props => (
  <div className="post row">
    <div className="author col-md-3">
      <Link href="/" to={`/user/${encodeURIComponent(props.author.email)}`}>
        <div className="photo" style={{ backgroundImage: `url('${props.author.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')` }} />
        {props.author.displayName}
      </Link>
    </div>
    <div className="text col-md-9">
      <p className="body">{props.post.body}</p>
      <p className="date">{props.post.timeStamp.toDate().toLocaleString()}</p>
    </div>
  </div>
);

export default Post;
