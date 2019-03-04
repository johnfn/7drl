import { Sprite, Texture, Container } from "pixi.js";
import { GameState } from "./state";
import { C } from "./constants";

export abstract class Entity extends Container {
  state: GameState;
  mapX : number;
  mapY : number;

  constructor(props: {
    state : GameState;
    parent: Container;
    mapX ?: number;
    mapY ?: number;
  }) {
    super();

    this.mapX = props.mapX || 0;
    this.mapY = props.mapY || 0;

    this.state = props.state;
    props.parent.addChild(this);
    this.state.entities.push(this);
  }

  abstract update(): void;

  baseUpdate(): void {
    this.x = this.mapX * C.TILE_WIDTH;
    this.y = this.mapY * C.TILE_HEIGHT;
  }

  destroy() {
    this.state.entities.splice(this.state.entities.indexOf(this), 1);
  }
}