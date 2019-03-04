import { Entity, CombatEntity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { IPoint } from "./point";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
// monster qualities: some default qualities
// (move speed, attack damage, number of attacks, hp, exp, drops)
// special abilities
// status ? 
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