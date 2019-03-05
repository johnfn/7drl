import { Entity, CombatEntity } from "../entity";
import { GameState } from "../state";
import { Graphics } from "pixi.js";
import { IPoint } from "../point";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
// monster qualities: some default qualities
// (move speed, attack damage, number of attacks, hp, exp, drops)
// some adjectives: 
// movement AI types: idle, cowardly, wandering, mean
// default states: idle, aggro. default is (idle/aggro) -> (wandering/mean)
// additional qualities: fast?, flying?, flocking?, dangerous?
// special abilities, status? LATER
// * FIRST AREA : yellow/brown? sorta dingy. Old farmlands around the town. Tutorial?
// Old Scarecrow    (idle/idle) // doesnt move when idle, doesnt move when angered. atk=0
// Gray slime       (patrolling/patrolling) // set movement pattern
// Brown slime      (wandering/wandering) // doesnt anger. maybe only move diagonally?
// Sleepy rat       (idle/mean) // starts out sleeping
// * SECOND AREA : some more forest. still kinda farmy
// Brown spider     () // just the default, wandering/mean
// Honey badger     (dangerous, mean/mean/mean) // unusually powerful for this level, mainly because the 3rd anger state has a lot of extra damage
// Old Scarecrow?   (dangerous, mean/mean) // zero move but will initiate on player if within range
// Grimdark farmhand (patrolling/mean) // has a set movement pattern. better to avoid him
// Some ants        (flocking) // comes in packs
// Grass snake      (invisible, idle/mean)
// Rabid rabbit     (cowardly/mean)
// Large bat        (flying, wandering/wandering)
// Hungry fox       (mean/mean)
// Wild goose       (flocking, mean/mean)
// Wolf             (flocking, dangerous, mean/mean) // dangerous
export class Monster extends CombatEntity {
  constructor(state: GameState, position: IPoint) {
    super({
      state,
      maxHealth: 3,
      parent: state.app.stage,
      // TODO(bowei): questionable
      mapX     : position.x,
      mapY     : position.y,
    });

    const graphics = new Graphics();
    
    // monster sprite
    graphics.beginFill(0xFF00FF);
    graphics.drawRect(0, 0, 24, 24);
    this.addChild(graphics);
    graphics.x = 4;
    graphics.y = 4;
  }

  update() {
    // update my position ?? nahh

    let proposedX = this.mapX; 
    let proposedY = this.mapY;
  }

  attack(target: CombatEntity) {
    target.health -= 1;
    console.log('got here', target.health);
  }

  customDestroyLogic() { }
}
