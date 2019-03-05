import { CombatEntity } from "../combatentity";
import { GameState } from "../state";
import { Graphics } from "pixi.js";
import { IPoint } from "../point";
import { Species, MONSTER_CLASSES } from "./monstertypes";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
export class Monster extends CombatEntity {
  public species: Species;
  constructor(props: {state: GameState, position: IPoint, species: Species }) {
    super({
      state: props.state,
      maxHealth: 3,
      parent: props.state.app.stage,
      // TODO(bowei): questionable
      worldX     : props.position.x,
      worldY     : props.position.y,
    });
    this.species = props.species;

    this.addChild(props.species.createGraphics());

    //const graphics = new Graphics();
    //// monster sprite
    //graphics.beginFill(0xFF00FF);
    //graphics.drawRect(0, 0, 24, 24);
    //this.addChild(graphics);
    //graphics.x = 4;
    //graphics.y = 4;
  }

  update() {
    // update my position ?? nahh

    let proposedX = this.worldX; 
    let proposedY = this.worldY;
  }

  attack(target: CombatEntity) {
    target.health -= this.species.baseAttack;
  }

  customDestroyLogic() { }
}
