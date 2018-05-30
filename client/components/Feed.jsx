import React from 'react';
import { Redirect } from 'react-router-dom';
import Post from './Post';

const Feed = ({
  users,
  blogs,
  db,
  currentUser
}) => {
  if (currentUser === null) {
    return <Redirect to="/login" />;
  } else if (blogs === null || users === null) {
    return <img className="spinner" src="img/loading.gif" />;
  } else if (blogs.length > 0) {
    return blogs.map((blog, i) => (
      <Post
        currentUser={currentUser}
        db={db}
        author={users.find(user => user.email === blog.author)}
        post={blog}
        key={i}
      />
    ));
  }
  return <h3 className="no-posts">No posts yet 😔</h3>;
};

export default Feed;
