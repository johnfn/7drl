import { Sprite, Texture, Container } from "pixi.js";
import { GameState } from "./state";

export abstract class Entity extends Container {
  state: GameState;
  x    : number;
  y    : number;

  constructor(props: {
    state : GameState;
    parent: Container;
    x    ?: number;
    y    ?: number;
  }) {
    super();

    this.x = props.x || 0;
    this.y = props.y || 0;

    this.state = props.state;
    props.parent.addChild(this);
    this.state.entities.push(this);
  }

  abstract update(): void;

  destroy() {
    this.state.entities.splice(this.state.entities.indexOf(this), 1);
  }
}