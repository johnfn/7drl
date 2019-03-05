import { Application, Container } from "pixi.js";
import { Entity, CombatEntity } from "./entity";
import { World } from "./world";
import { Player } from "./player";
import { Keyboard } from "./keyboard";
import { Monster } from "./monsters/monster";
import { Camera } from "./camera";
import { IPoint } from "./point";

export class GameState {
  public app      : Application;
  public stage    : Container;
  public keyboard : Keyboard;
  public entities : Entity[];
  public world   !: World;
  public player  !: Player;
  public camera  !: Camera;
  public tick     : number = 0;

  constructor(props: {
    app     : Application;
    keyboard: Keyboard;
  }) {
    this.app      = props.app;
    this.keyboard = props.keyboard;
    this.stage    = this.app.stage;
    this.entities = [];
  }

  getMonsters(): CombatEntity[] {
    return this.entities.filter(e => e instanceof Monster) as Monster[];
  }

  getMonsterAt(pos: IPoint): Monster | null {
    return this.getMonsters().filter(m => (m.mapX == pos.x && m.mapY == pos.y))[0];
  }
}
