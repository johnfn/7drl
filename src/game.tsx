import React from 'react';
import { Application } from 'pixi.js';
import { World } from './game/world';
import { GameState } from './game/state';
import { C } from './game/constants';
import { Player } from './game/player';
import { Keyboard } from './game/keyboard';

export class Game extends React.Component<{}, {}> {
  initialized = false;
  state      !: GameState;
  canvas      : HTMLCanvasElement | null = null;

  componentDidMount() {
    if (!this.initialized) {
      this.initialized = true;

      this.gameInit();
    }
  }

  gameInit() {
    if (!this.canvas) { return; }

    const app = new Application({
      width          : C.GAME_WIDTH,
      height         : C.GAME_HEIGHT,
      backgroundColor: 0x1099bb,
      view           : this.canvas,
    });

    const keyboard = new Keyboard();

    this.state = new GameState({
      app,
      keyboard,
    });

    this.state.world  = new World(this.state);
    this.state.player = new Player(this.state);

    window.requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    this.state.keyboard.update();

    for (const ent of this.state.entities) {
      ent.update();
    }

    window.requestAnimationFrame(() => this.gameLoop());
  }

  render() {
    return (
      <div>
        <canvas ref={canvas => this.canvas = canvas}>

        </canvas>
      </div>
    );
  }
}
