import React, { Component } from 'react';
import { Game } from './game';

class App extends Component {
  render() {
    return (
      <div
        style={{
          padding: "20px",
        }}
      >
        <Game />
      </div>
    );
  }
}

export default App;
