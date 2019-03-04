import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { C } from "./constants";

export class Player extends Entity {
  mapX = 0;
  mapY = 0;

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
      x     : 32 * 5,
      y     : 32 * 5,
    });

    this.mapX = 5;
    this.mapY = 5;

    const graphics = new Graphics();
    
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 32, 32);
    
    this.addChild(graphics);
  }

  update() {
    if (this.state.keyboard.justDown.A) {
      this.mapX -= 1;
    }
    if (this.state.keyboard.justDown.D) {
      this.mapX += 1;
    }
    if (this.state.keyboard.justDown.W) {
      this.mapY -= 1;
    }
    if (this.state.keyboard.justDown.S) {
      this.mapY += 1;
    }

    this.x = this.mapX * C.TILE_WIDTH;
    this.y = this.mapY * C.TILE_HEIGHT;
  }
}