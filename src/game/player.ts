import { CombatEntity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { C } from "./constants";
import { IPoint } from "./point";

export class Player extends CombatEntity {
  constructor(state: GameState, playerStart: IPoint) {
    super({
      state,
      maxHealth: 20,
      parent: state.app.stage,
      mapX     : playerStart.x,
      mapY     : playerStart.y
    });

    const graphics = new Graphics();
    
    graphics.beginFill(0xFF0000);
    graphics.drawRect(0, 0, 24, 24);
    this.addChild(graphics);
    graphics.x = 4;
    graphics.y = 4;
  }

  update() {
    let proposedX: number = this.mapX, proposedY: number = this.mapY;

    const frameDelay = this.state.tick % 6 === 0; // 10 repeats per sec
    if ((this.state.keyboard.delayedDown.H && frameDelay) || this.state.keyboard.justDown.H) {
      proposedX -= 1;
    }
    if ((this.state.keyboard.delayedDown.L && frameDelay) || this.state.keyboard.justDown.L) {
      proposedX += 1;
    }
    if ((this.state.keyboard.delayedDown.J && frameDelay) || this.state.keyboard.justDown.J) {
      proposedY += 1;
    }
    if ((this.state.keyboard.delayedDown.K && frameDelay) || this.state.keyboard.justDown.K) {
      proposedY -= 1;
    }
    if ((this.state.keyboard.delayedDown.Y && frameDelay) || this.state.keyboard.justDown.Y) {
      proposedX -= 1;
      proposedY -= 1;
    }
    if ((this.state.keyboard.delayedDown.U && frameDelay) || this.state.keyboard.justDown.U) {
      proposedX += 1;
      proposedY -= 1;
    }
    if ((this.state.keyboard.delayedDown.B && frameDelay) || this.state.keyboard.justDown.B) {
      proposedX -= 1;
      proposedY += 1;
    }
    if ((this.state.keyboard.delayedDown.N && frameDelay) || this.state.keyboard.justDown.N) {
      proposedX += 1;
      proposedY += 1;
    }

    // check if monster is occupying this tile
    let maybeMonster = this.state.getMonsterAt({x: proposedX, y: proposedY});
    if (maybeMonster) {
      // do combat: you hit him
      const target = maybeMonster;
      // TODO(bowei): what's our atk value?
      this.attack(target);
      target.renderHealth();
      // now monster should attack me back
      target.attack(this);
      this.renderHealth();
    } else {
      this.mapX = proposedX;
      this.mapY = proposedY;
    }

    this.state.camera.setX(this.mapX * C.TILE_SIZE - C.GAME_WIDTH  / 2);
    this.state.camera.setY(this.mapY * C.TILE_SIZE - C.GAME_HEIGHT / 2);
  }

  attack(target: CombatEntity) {
    target.health -= 1;
  }

  customDestroyLogic() { }
}