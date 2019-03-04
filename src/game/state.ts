import { Application, Container } from "pixi.js";
import { Entity } from "./entity";
import { World } from "./world";
import { Player } from "./player";
import { Keyboard } from "./keyboard";
import { Monster } from "./monster";
import { Camera } from "./camera";
import { IPoint } from "./point";

export class GameState {
  public app      : Application;
  public stage    : Container;
  public keyboard : Keyboard;
  public entities : Entity[];
  public world   !: World;
  public player  !: Player;
  public monsters!: Monster[];
  public camera  !: Camera;

  constructor(props: {
    app     : Application;
    keyboard: Keyboard;
  }) {
    this.app      = props.app;
    this.keyboard = props.keyboard;
    this.stage    = this.app.stage;
    this.entities = [];
  }

  getMonsterAt(pos: IPoint): Monster | null {
    return this.monsters.filter(m => (m.mapX == pos.x && m.mapY == pos.y))[0];
  }
}