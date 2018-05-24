import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.authorized = false;
  }
  render() {
    return (
      <div>
        <h1>
          <span role="img" aria-label="wave">🌊</span>
          Blogs
          <span role="img" aria-label="wave">🌊</span>
        </h1>
      </div>
    );
  }
}

export default App;
