import { CombatEntity } from "../combatentity";
import { GameState } from "../state";
import { Graphics } from "pixi.js";
import { IPoint } from "../point";
import { Species, MONSTER_CLASSES, MonsterState } from "./monstertypes";
import { Util } from "../util";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
export class Monster extends CombatEntity {
  public species: Species;
  public activityState: MonsterState = "idle";
  // position = world position
  constructor(props: {state: GameState, position: IPoint, species: Species }) {
    super({
      state: props.state,
      maxHealth: props.species.baseMaxHealth,
      parent: props.state.app.stage,
      worldX     : props.position.x,
      worldY     : props.position.y,
    });
    this.species = props.species;

    this.addChild(props.species.createGraphics());
  }

  update() {
    // TODO(bowei): compute number of actions, then do them
    //this.act();
  }

  act() {
    if (!this.tryMove()) {
      // always attack the player if possible. TODO(bowei): open up some options here
      this.attack(this.state.player);
    }
  }

  // either move according to movement pattern, or attack or something
  tryMove(): boolean {
    let movementAIMode = this.species.behavior[this.activityState];
    // first find how far we are from player. if we are adjacent then don't move
    let distance: number = this.state.player.getWorldPosition().diagonalDistance(this.getWorldPosition());
    if (distance > 1) {
      // TODO(bowei): route around other monsters
      switch (this.species.behavior[this.activityState]) {
        case 'sessile':
          break;
        case 'cowardly':
        case 'wandering':
          let direction: number = Util.Random(4);
          switch (direction) {
            case 0:
              this.worldX += 1;
              break;
            case 1:
              this.worldX -= 1;
              break;
            case 2:
              this.worldY += 1;
              break;
            case 3:
              this.worldY -= 1;
              break;
          }
          break;
        case 'patrolling':
          break;
        case 'mean':
          // pathfind towards player in same chunk
          break;
      }
      return true; // succeeded
    } else {
      return false;
    }
  }

  maybeUpdateState() {
    if (this.health <= 0) {
      this.destroy();
    }
    this.renderHealth();
    // transition state
    if (this.activityState == "idle" && this.health < this.maxHealth) {
      this.activityState = "aggro";
    }
  }

  attack(target: CombatEntity) {
    target.health -= this.species.baseAttack;
    target.maybeUpdateState();
  }

  customDestroyLogic() { }
}
