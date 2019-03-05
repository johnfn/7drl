import { Graphics } from "pixi.js";
import { Sprite, Texture, Container } from "pixi.js";
import { GameState } from "./state";
import { C } from "./constants";

export abstract class Entity extends Container {
  state : GameState;
  worldX: number;
  worldY: number;

  constructor(props: {
    state   : GameState;
    parent  : Container;
    worldX ?: number;
    worldY ?: number;
  }) {
    super();

    this.worldX = props.worldX || 0;
    this.worldY = props.worldY || 0;

    this.state = props.state;
    props.parent.addChild(this);
    this.state.entities.push(this);
  }

  abstract update(): void;

  baseUpdate(): void {
    this.x = this.worldX * C.TILE_SIZE;
    this.y = this.worldY * C.TILE_SIZE;

    this.update();
  }

  abstract customDestroyLogic(): void;

  destroy() {
    this.state.entities.splice(this.state.entities.indexOf(this), 1);
    this.parent.removeChild(this);

    this.customDestroyLogic();
  }
}

export abstract class CombatEntity extends Entity {
  // put in a health bar
  static HEALTH_BAR_WIDTH = 30;

  public maxHealth: number;
  public health   : number;

  private graphicsHealthFull : Graphics;
  private graphicsHealthEmpty: Graphics;

  constructor(props: {
    state : GameState;
    parent: Container;
    maxHealth: number;
    worldX ?: number;
    worldY ?: number;
  }) {
    super(props);

    this.maxHealth = props.maxHealth;
    this.health    = props.maxHealth;

    // health bar . TODO(bowei): wtf is this
    this.graphicsHealthFull = new Graphics();
    this.addChild(this.graphicsHealthFull);

    this.graphicsHealthEmpty = new Graphics();
    this.addChild(this.graphicsHealthEmpty);

    this.renderHealth();
  }

  renderHealth(): void {
    if (this.health <= 0) {
      this.destroy();
    }
    // TODO(bowei): do we really want to repeatedly call drawRect every time
    this.graphicsHealthFull.beginFill(0xFF8080);
    let width = CombatEntity.HEALTH_BAR_WIDTH * ( this.health / this.maxHealth );
    this.graphicsHealthFull.drawRect(0,0,width,2);
    this.graphicsHealthFull.x = 1;
    this.graphicsHealthFull.y = 1;

    this.graphicsHealthEmpty.beginFill(0x202020);
    this.graphicsHealthEmpty.drawRect(width,0,CombatEntity.HEALTH_BAR_WIDTH - width,2);
    this.graphicsHealthEmpty.x = 1;
    this.graphicsHealthEmpty.y = 1;
  }

  abstract update(): void;

  abstract customDestroyLogic(): void;

  abstract attack(target: CombatEntity): void;
}