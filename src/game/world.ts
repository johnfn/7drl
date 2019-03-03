import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";

export class World extends Entity {
  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
    });

    const graphics = new Graphics();
    
    graphics.beginFill(0xff0000);
    graphics.drawRect(0, 0, 32, 32);
    
    this.addChild(graphics);
  }

  update() {
  }
}