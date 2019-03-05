import { CombatEntity } from "../combatentity";
import { GameState } from "../state";
import { Graphics } from "pixi.js";
import { C } from "../constants";
import { IPoint } from "../point";
import { PlayerText } from "./playertext";

export class Player extends CombatEntity {
  playerText: PlayerText;

  constructor(state: GameState, playerStart: IPoint) {
    super({
      state,
      maxHealth: 20,
      parent   : state.app.stage,
      worldX   : playerStart.x,
      worldY   : playerStart.y
    });

    this.playerText = new PlayerText(state, this);

    const graphics = new Graphics();
    
    graphics.beginFill(0xFF0000);
    graphics.drawRect(0, 0, 24, 24);
    this.addChild(graphics);
    graphics.x = 4;
    graphics.y = 4;
  }

  getMovementDeltas(): { x: number, y: number } {
    const deltas: { x: number, y: number } = { x: 0, y: 0 };
    const frameDelay = this.state.tick % 6 === 0; // 10 repeats per sec

    if ((this.state.keyboard.delayedDown.H && frameDelay) || this.state.keyboard.justDown.H) {
      deltas.x -= 1;
    }

    if ((this.state.keyboard.delayedDown.L && frameDelay) || this.state.keyboard.justDown.L) {
      deltas.x += 1;
    }

    if ((this.state.keyboard.delayedDown.J && frameDelay) || this.state.keyboard.justDown.J) {
      deltas.y += 1;
    }

    if ((this.state.keyboard.delayedDown.K && frameDelay) || this.state.keyboard.justDown.K) {
      deltas.y -= 1;
    }

    if ((this.state.keyboard.delayedDown.Y && frameDelay) || this.state.keyboard.justDown.Y) {
      deltas.x -= 1;
      deltas.y -= 1;
    }

    if ((this.state.keyboard.delayedDown.U && frameDelay) || this.state.keyboard.justDown.U) {
      deltas.x += 1;
      deltas.y -= 1;
    }

    if ((this.state.keyboard.delayedDown.B && frameDelay) || this.state.keyboard.justDown.B) {
      deltas.x -= 1;
      deltas.y += 1;
    }

    if ((this.state.keyboard.delayedDown.N && frameDelay) || this.state.keyboard.justDown.N) {
      deltas.x += 1;
      deltas.y += 1;
    }

    return deltas;
  }

  update() {
    let proposedX = this.worldX, proposedY = this.worldY;
    const { x: deltaX, y: deltaY } = this.getMovementDeltas();
    let collision = false;

    proposedX += deltaX;
    proposedY += deltaY;

    // check if monster is occupying this tile
    let monster = this.state.getMonsterAt({ x: proposedX, y: proposedY });
    if (monster) {
      // do combat: you hit him
      const target = monster;
      // TODO(bowei): what's our atk value?
      this.attack(target);
      target.renderHealth();
      // now monster should attack me back
      target.attack(this);
      this.renderHealth();

      collision = true;
    }

    let wall = this.state.world.isAWall(proposedX, proposedY);

    if (wall) {
      collision = true;
    }

    if (!collision) {
      this.worldX = proposedX;
      this.worldY = proposedY;
    }

    this.state.camera.setX(this.worldX * C.TILE_SIZE - C.GAME_WIDTH  / 2);
    this.state.camera.setY(this.worldY * C.TILE_SIZE - C.GAME_HEIGHT / 2);
  }

  attack(target: CombatEntity) {
    target.health -= 1;
  }

  customDestroyLogic() { }
}
