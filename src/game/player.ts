import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { C } from "./constants";

export class Player extends Entity {
  /**
   * x position in the world map
   */
  worldX: number;

  /**
   * y position in the world map
   */
  worldY: number;

  tick = 0;

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
      mapX     : 5,
      mapY     : 5,
    });

    this.worldX = 0;
    this.worldY = 0;

    const graphics = new Graphics();
    
    graphics.beginFill(0xFF0000);
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
    let proposedX: number = this.mapX, proposedY: number = this.mapY;

    // TODO: this has a 1/10 chance of doubling your speed
    const frameDelay = this.tick++ % 10 === 0;
    if ((this.state.keyboard.down.H && frameDelay) || this.state.keyboard.justDown.H) {
      proposedX -= 1;
    }
    if ((this.state.keyboard.down.L && frameDelay) || this.state.keyboard.justDown.L) {
      proposedX += 1;
    }
    if ((this.state.keyboard.down.J && frameDelay) || this.state.keyboard.justDown.J) {
      proposedY += 1;
    }
    if ((this.state.keyboard.down.K && frameDelay) || this.state.keyboard.justDown.K) {
      proposedY -= 1;
    }
    if ((this.state.keyboard.down.Y && frameDelay) || this.state.keyboard.justDown.Y) {
      proposedX -= 1;
      proposedY -= 1;
    }
    if ((this.state.keyboard.down.U && frameDelay) || this.state.keyboard.justDown.U) {
      proposedX += 1;
      proposedY -= 1;
    }
    if ((this.state.keyboard.down.B && frameDelay) || this.state.keyboard.justDown.B) {
      proposedX -= 1;
      proposedY += 1;
    }
    if ((this.state.keyboard.down.N && frameDelay) || this.state.keyboard.justDown.N) {
      proposedX += 1;
      proposedY += 1;
    }

    // check if monster is occupying this tile
    if (proposedY === 6 && proposedX === 5) {
      // do combat: you hit him
      const target = this.state.monsters[0];
      // TODO(bowei): what's our atk value?
      target.health -= 1;
      //target.rerenderHealth({ damage: -1 });
      target.renderHealth();
      // dont worry about monster hitting you, that's in monster's update() call
    } else {
      this.mapX = proposedX;
      this.mapY = proposedY;
    }

    this.state.camera.setX(this.mapX * C.TILE_WIDTH - C.SCREEN_WIDTH / 2);
    this.state.camera.setY(this.mapY * C.TILE_HEIGHT - C.SCREEN_HEIGHT / 2);
  }
}