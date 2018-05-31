import React from 'react';
import { Redirect } from 'react-router-dom';
import Post from './Post';

const Feed = ({
  users,
  blogs,
  db,
  currentUser,
  onReply,
}) => {
  if (currentUser === null) {
    return <Redirect to="/login" />;
  } else if (blogs === null || users === null) {
    return <img className="spinner" src="img/loading.gif" />;
  } else if (blogs.length > 0) {
    return blogs.map(blog => (
      <Post
        users={users}
        onReply={p => (onReply ? onReply(p) : null)}
        currentUser={currentUser}
        db={db}
        author={users.find(user => user.email === blog.author)}
        post={blog}
        key={blog.id}
      />
    ));
  }
  return <h3 className="no-posts">No posts yet 😔</h3>;
};

export default Feed;
