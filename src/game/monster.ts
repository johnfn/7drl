import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { C } from "./constants";
import { IPoint } from "./point";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
export class Monster extends Entity {

  static HEALTH_BAR_WIDTH = 30;

  public maxHealth = 4;
  public health = 4;

  private graphicsHealthFull!: Graphics;
  private graphicsHealthEmpty!: Graphics;

  constructor(state: GameState, position: IPoint) {
    super({
      state,
      parent: state.app.stage,
      // TODO(bowei): questionable
      mapX     : position.x,
      mapY     : position.y,
    });

    const graphics = new Graphics();
    
    // monster sprite
    graphics.beginFill(0xFF00FF);
    graphics.drawRect(0, 0, 24, 24);
    this.addChild(graphics);
    graphics.x = 4;
    graphics.y = 4;

    // health bar . TODO(bowei): wtf is this
    this.graphicsHealthFull = new Graphics();
    this.addChild(this.graphicsHealthFull);

    this.graphicsHealthEmpty = new Graphics();
    this.addChild(this.graphicsHealthEmpty);

    this.renderHealth();
  }

  update() {
      // update my position ?? nahh
      let proposedX: number = this.mapX, proposedY: number = this.mapY;
  }

  renderHealth(): void {
    if (this.health <= 0) {
      this.parent.removeChild(this);
      this.state.monsters = this.state.monsters.filter(other_m => other_m != this);
    }
    this.graphicsHealthFull.beginFill(0xFF8080);
    let width = Monster.HEALTH_BAR_WIDTH * ( this.health / this.maxHealth );
    this.graphicsHealthFull.drawRect(0,0,width,2);
    this.graphicsHealthFull.x = 1;
    this.graphicsHealthFull.y = 1;

    this.graphicsHealthEmpty.beginFill(0x202020);
    this.graphicsHealthEmpty.drawRect(width,0,Monster.HEALTH_BAR_WIDTH - width,2);
    this.graphicsHealthEmpty.x = 1;
    this.graphicsHealthEmpty.y = 1;
  }

}