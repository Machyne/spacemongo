import React, { Component, PropTypes } from 'react';
import Matter from 'matter-js';

import {
  AudioPlayer,
  Loop,
  Stage,
  KeyListener,
  World,
} from 'react-game-kit';

import Character from './character';

import GalaxyStore from './stores/galaxy-store';

export default class Galaxy extends Component {

  static propTypes = {
    onQuit: PropTypes.func,
  };

  physicsInit = (engine) => {
    const bottomWall = Matter.Bodies.rectangle(
      512 * 3, 448,
      1024 * 3, 64,
      {
        isStatic: true,
      },
    );

    const topWall = Matter.Bodies.rectangle(
      512 * 3, 448,
      1024 * 3, 64,
      {
        isStatic: true,
      },
    );

    const leftWall = Matter.Bodies.rectangle(
      -64, 288,
      64, 576,
      {
        isStatic: true,
      },
    );

    const rightWall = Matter.Bodies.rectangle(
      3008, 288,
      64, 576,
      {
        isStatic: true,
      },
    );

    // Matter.World.addBody(engine.world, bottomWall);
    // Matter.World.addBody(engine.world, topWall);
    // Matter.World.addBody(engine.world, leftWall);
    // Matter.World.addBody(engine.world, rightWall);
  }

  constructor(props) {
    super(props);

    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 27) {
      this.props.onQuit();
    }
  }

  componentDidMount() {
    this.player = new AudioPlayer('/music.wav', () => {
      this.stopMusic = this.player.play({ loop: true, offset: 1, volume: 0.35 });
    });

    window.addEventListener('keypress', this.handleKeyPress);
    this.keyListener.subscribe([
      this.keyListener.LEFT,
      this.keyListener.RIGHT,
      this.keyListener.UP,
      this.keyListener.DOWN,
    ]);
  }

  componentWillUnmount() {
    this.stopMusic();
    window.removeEventListener('keypress', this.handleKeyPress);
    this.keyListener.unsubscribe();
  }

  render() {
    return (
      <Loop>
        <Stage style={{ background: 'url(/spacebg.jpg)' }}>
          <World
            onInit={this.physicsInit}
          >
            <Character
              store={GalaxyStore}
              keys={this.keyListener}
            />
          </World>
        </Stage>
      </Loop>
    );
  }

}
