import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Users extends Component {
  constructor(props) {
    super(props);
    props.onGetUsers();
  }
  render() {
    const { users } = this.props;
    if (users === null) {
      return <img className="spinner" src="/img/loading.gif" />;
    }
    return (
      <div>
        <h1>He had won the victory over himself. He loved Big Brother.</h1>
        {users.map(user => (
          <div className="row user" key={user.uid}>
            <div className="col-md-4">
              <div style={{ backgroundImage: `url('${user.photoURL || 'https://png.icons8.com/ios/50/000000/login-as-user-filled.png'}')`, margin: '0 auto' }} className="photo" />
            </div>
            <div className="col-md-8">
              <p className="name">
                <Link href="/" to={`/user/${encodeURIComponent(user.email)}`}>
                  {user.displayName}
                </Link>
              </p>
              <p className="email">
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
            </div>
          </div>
      ))}
      </div>
    );
  }
}

export default Users;
