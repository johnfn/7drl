import { Graphics, Container } from "pixi.js";
import { Entity } from "./entity";
import { GameState } from "./state";

export abstract class CombatEntity extends Entity {
  // put in a health bar
  static HEALTH_BAR_WIDTH = 30;
  static HEALTH_BAR_COLOR_RED = 0xFF8080;
  static HEALTH_BAR_COLOR_BLACK = 0x202020;

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
    this.graphicsHealthFull.beginFill(CombatEntity.HEALTH_BAR_COLOR_RED);
    let width = CombatEntity.HEALTH_BAR_WIDTH * ( this.health / this.maxHealth );
    this.graphicsHealthFull.drawRect(0,0,width,2);
    this.graphicsHealthFull.x = 1;
    this.graphicsHealthFull.y = 1;

    this.graphicsHealthEmpty.beginFill(CombatEntity.HEALTH_BAR_COLOR_BLACK);
    this.graphicsHealthEmpty.drawRect(width,0,CombatEntity.HEALTH_BAR_WIDTH - width,2);
    this.graphicsHealthEmpty.x = 1;
    this.graphicsHealthEmpty.y = 1;
  }
  abstract update(): void;
  abstract customDestroyLogic(): void;
  abstract attack(target: CombatEntity): void;
}
