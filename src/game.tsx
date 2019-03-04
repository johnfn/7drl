import React from 'react';
import { Application } from 'pixi.js';
import { World } from './game/world';
import { GameState } from './game/state';
import { C } from './game/constants';
import { Player } from './game/player';
import { Keyboard } from './game/keyboard';
import { Monster } from './game/monster';
import { Camera } from './game/camera';

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

    const camera = new Camera();

    this.state.camera = camera;

    this.state.world  = new World(this.state);
    const playerInitialPosition = { x: 5, y: 5 };
    this.state.player = new Player(this.state, playerInitialPosition);
    this.state.world.generateMonsters(this.state);

    window.requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    this.state.camera.update(this.state);
    this.state.keyboard.update(this.state.tick);
    this.state.tick++;

    for (const ent of this.state.entities) {
      ent.baseUpdate();
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
