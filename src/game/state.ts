import { Application, Container } from "pixi.js";
import { Entity } from "./entity";
import { World } from "./world";
import { Player } from "./player/player";
import { Keyboard } from "./keyboard";
import { Monster } from "./monsters/monster";
import { Camera } from "./camera";
import { Overlay } from "./overlay";
import { IPoint } from "./point";

export class GameState {
  public app      : Application;
  public stage    : Container; // stuff moved by the camera
  public overlayStage: Container; // stuff that doesnt move with the camera
  public keyboard : Keyboard;
  public entities : Entity[];
  public world    : World;
  public player   : Player;
  public camera   : Camera;
  public overlay  : Overlay;
  public tick     : number = 0;

  constructor(props: {
    app     : Application;
    keyboard: Keyboard;
    camera  : Camera;
  }) {
    this.app      = props.app;
    this.keyboard = props.keyboard;
    this.camera   = props.camera;
    this.stage    = new Container();
    this.app.stage.addChild(this.stage);
    this.overlayStage    = new Container();
    this.app.stage.addChild(this.overlayStage);
    this.entities = [];

    // must initialize in correct order - probably
    this.overlay  = new Overlay({state: this});
    this.world  = new World(this);

    const playerInitialPosition = { x: 5, y: 5 };
    this.player = new Player(this, playerInitialPosition);
  }

  getMonsters(): Monster[] {
    return this.entities.filter(e => e instanceof Monster) as Monster[];
  }

  getMonsterAt(pos: IPoint): Monster | null {
    return this.getMonsters().filter(m => (m.worldX == pos.x && m.worldY == pos.y))[0];
  }

  update(): void {
    this.camera.update(this);
    this.keyboard.update(this.tick);
    this.tick++;

    for (const ent of this.entities) {
      ent.baseUpdate();
    }
  }
}
