import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";

export class Player extends Entity {
  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
      x     : 100,
      y     : 100,
    });

    const graphics = new Graphics();
    
    graphics.beginFill(0x00ff00);
    graphics.drawRect(0, 0, 32, 32);
    
    this.addChild(graphics);
  }

  update() {
    if (this.state.keyboard.down.A) {
      this.x -= 5;
    }
    if (this.state.keyboard.down.D) {
      this.x += 5;
    }
    if (this.state.keyboard.down.W) {
      this.y -= 5;
    }
    if (this.state.keyboard.down.S) {
      this.y += 5;
    }
  }
}