import React, { Component, PropTypes } from 'react';
import { AudioPlayer } from 'react-game-kit';

export default class Intro extends Component {
  static propTypes = {
    onStart: PropTypes.func,
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.startNoise.play();
      this.props.onStart();
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      blink: false,
    };
  }

  componentDidMount() {
    this.startNoise = new AudioPlayer('/start.wav');
    window.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
    cancelAnimationFrame(this.animationFrame);
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>HIT ENTER TO START</div>
    );
  }
}
