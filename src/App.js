import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Intro from './intro';
import Galaxy from './galaxy';

export default class Spacemongo extends Component {

  handleStart = () => {
    this.setState({
      gameState : 1,
    });
  };

  handleQuit = () => {
    this.setState({
      gameState : 2,
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      gameState : 0,
    };

    this.gameStates = [
      <Intro onStart={this.handleStart} />,
      <Galaxy onQuit={this.handleQuit} />,
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>,
    ];
  }

  render() {
    return this.gameStates[this.state.gameState];
  }
}
