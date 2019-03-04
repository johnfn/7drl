import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { C } from "./constants";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
export class Monster extends Entity {

  public health: number = 0;

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
      mapX     : 5,
      mapY     : 6,
    });

    const graphics = new Graphics();
    
    // monster sprite
    graphics.beginFill(0xFF00FF);
    graphics.drawRect(0, 0, 24, 24);
    this.addChild(graphics);
    graphics.x = 4;
    graphics.y = 4;

    // health bar . TODO(bowei): wtf is this
    const graphicsHealth = new Graphics();
    graphicsHealth.beginFill(0xFF8080);
    graphicsHealth.drawRect(0,0,30,2);
    this.addChild(graphicsHealth);
    graphicsHealth.x = 1;
    graphicsHealth.y = 1;
  }

  update() {
      // update my position ??
      let proposedX: number = this.mapX, proposedY: number = this.mapY;
  }
}