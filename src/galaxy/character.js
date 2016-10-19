import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Matter from 'matter-js';

import {
  Body,
  Sprite,
} from 'react-game-kit';

@observer
export default class Character extends Component {

  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  handlePlayStateChanged = (state) => {
    this.setState({
      spritePlaying: state ? true : false,
    });
  };

  move = (body, x, y) => {
    Matter.Body.setVelocity(body, { x, y });
  };

  checkKeys = (shouldMoveStageLeft, shouldMoveStageRight) => {
    const { keys, store } = this.props;
    const { body } = this.body;

    let characterState = this.state.characterState;

    let isUp = keys.isDown(keys.UP);
    let isDown = keys.isDown(keys.DOWN);
    let isLeft = keys.isDown(keys.LEFT) && shouldMoveStageLeft;
    let isRight = keys.isDown(keys.RIGHT) && shouldMoveStageRight;

    let [x, y] = [0, 0];

    const increment = 5;
    if (isUp) {
      y += increment;
    } else if (isDown) {
      y -= increment;
    }
    if (isRight) {
      x += increment;
    } else if (isLeft) {
      x -= increment;
    }

    this.move(body, x, y);

    if (characterState == 8) {
      characterState = 0;
    } else {
      characterState++;
    }

    this.setState({
      characterState,
      repeat: true,
    });
  }

  update = () => {
    const { store } = this.props;
    const { body } = this.body;

    const midPoint = Math.abs(store.stageX) + 448;

    // const shouldMoveStageLeft = body.position.x < midPoint && store.stageX < 0;
    // const shouldMoveStageRight = body.position.x > midPoint && store.stageX > -2048;

    this.checkKeys(true, true);
    store.setCharacterPosition(body.position);

    this.lastX = body.position.x;
  };

  constructor(props) {
    super(props);

    this.loopID = null;
    this.isJumping = false;
    this.isLeaving = false;
    this.lastX = 0;

    this.state = {
      characterState: 0,
      loop: false,
      spritePlaying: true,
    };
  }

  componentDidMount() {
    Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
  }

  getWrapperStyles() {
    const { characterPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;
    const targetX = x + stageX;

    return {
      position: 'absolute',
      transform: `translate(${x * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top',
    };
  }

  render() {
    const {x, y} = this.props.store.characterPosition;

    return (
      <div style={this.getWrapperStyles()}>
        <Body
          args={[x, y, 64, 64]}
          inertia={Infinity}
          ref={(b) => { this.body = b; }}
        >
          <Sprite
            repeat={this.state.repeat}
            onPlayStateChanged={this.handlePlayStateChanged}
            src="/playersprite.png"
            scale={this.context.scale * 2}
            state={this.state.characterState}
            steps={[0, 1, 2, 3, 4, 5]}
          />
        </Body>
      </div>
    );
  }
}
