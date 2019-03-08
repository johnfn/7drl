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
      parent   : state.stage,
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

  getMovementDeltas(): IPoint | null {
    const deltas: IPoint = { x: 0, y: 0 };
    const frameDelay = this.state.tick % 6 === 0; // 10 repeats per sec

    if ((this.state.keyboard.delayedDown.H && frameDelay) || this.state.keyboard.justDown.H) {
      deltas.x -= 1;
    } else if ((this.state.keyboard.delayedDown.L && frameDelay) || this.state.keyboard.justDown.L) {
      deltas.x += 1;
    } else if ((this.state.keyboard.delayedDown.J && frameDelay) || this.state.keyboard.justDown.J) {
      deltas.y += 1;
    } else if ((this.state.keyboard.delayedDown.K && frameDelay) || this.state.keyboard.justDown.K) {
      deltas.y -= 1;
    } else if ((this.state.keyboard.delayedDown.Y && frameDelay) || this.state.keyboard.justDown.Y) {
      deltas.x -= 1;
      deltas.y -= 1;
    } else if ((this.state.keyboard.delayedDown.U && frameDelay) || this.state.keyboard.justDown.U) {
      deltas.x += 1;
      deltas.y -= 1;
    } else if ((this.state.keyboard.delayedDown.B && frameDelay) || this.state.keyboard.justDown.B) {
      deltas.x -= 1;
      deltas.y += 1;
    } else if ((this.state.keyboard.delayedDown.N && frameDelay) || this.state.keyboard.justDown.N) {
      deltas.x += 1;
      deltas.y += 1;
    } else if ((this.state.keyboard.delayedDown['.'] && frameDelay) || this.state.keyboard.justDown['.']) {
      // try to rest in place
    } else {
      return null;
    }

    return deltas;
  }

  update() {
    let proposedX = this.worldX, proposedY = this.worldY;
    const command = this.getMovementDeltas();
    if (!command) {
      return; // player took no action
    }
    const { x: deltaX, y: deltaY } = command;
    let collision = false;

    proposedX += deltaX;
    proposedY += deltaY;

    // check if monster is occupying this tile
    let targetMonster = this.state.getMonsterAt({ x: proposedX, y: proposedY });
    if (targetMonster) {
      this.attack(targetMonster);

      collision = true;
    } else if (this.state.world.isAWall(proposedX, proposedY)) {
      collision = true;
    }

    if (!collision) {
      this.worldX = proposedX;
      this.worldY = proposedY;
    }

    if (deltaX != 0 || deltaY != 0) {
      for (let m of this.state.getMonsters()) {
        m.act();
      }
    }

    this.state.camera.setX(this.worldX * C.TILE_SIZE - C.GAME_WIDTH  / 2);
    this.state.camera.setY(this.worldY * C.TILE_SIZE - C.GAME_HEIGHT / 2);
    //this.state.camera.center = { x : this.worldX * C.TILE_SIZE, y: this.worldY * C.TILE_SIZE };
  }

  attack(target: CombatEntity) {
    // TODO(bowei): can we have some more attack
    target.health -= 1;
    target.maybeUpdateState();
  }

  customDestroyLogic() { }
  maybeUpdateState() {
    if (this.health <= 0) {
      this.destroy();
    }
    this.renderHealth();
    // TODO(bowei): game over
  }
}
