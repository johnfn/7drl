import React from 'react';
import { Application } from 'pixi.js';
import { World } from './game/world';
import { GameState } from './game/state';
import { C } from './game/constants';
import { Player } from './game/player/player';
import { Keyboard } from './game/keyboard';
import { Camera } from './game/camera';
import { Overlay } from "./game/overlay";

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
      backgroundColor: C.CANVAS_BACKGROUND_COLOR,
      view           : this.canvas,
    });

    const keyboard = new Keyboard();

    const camera = new Camera();

    this.state = new GameState({
      app,
      keyboard,
      camera
    });

    window.requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    this.state.update();
    //this.state.camera.update(this.state);
    //this.state.keyboard.update(this.state.tick);
    //this.state.tick++;

    //for (const ent of this.state.entities) {
    //  ent.baseUpdate();
    //}

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
