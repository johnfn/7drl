import { Graphics } from "pixi.js";
import { Sprite, Texture, Container } from "pixi.js";
import { GameState } from "./state";
import { C } from "./constants";
import { Point } from "./point";

export abstract class Entity extends Container {
  state : GameState;
  worldX: number;
  worldY: number;
  //parent: Container;

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
    //this.parent = props.parent; // NOTE(bowei): not sure if this conflicts with pixi??
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

  getWorldPosition(): Point {
    return new Point({ x : this.worldX, y: this.worldY });
  }
}
