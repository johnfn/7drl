import { Entity } from "./entity";
import { GameState } from "./state";
import { Text } from "pixi.js";

export class TextEntity extends Entity {
  textSprite: Text;

  constructor(state: GameState, parent: Entity, text: string) {
    super({ 
      state,
      parent,
    });

    this.textSprite = new Text(text, {
      fontFamily: 'FreePixel', 
      fontSize  : 24, 
      fill      : 0xffffff, 
      align     : 'left'
    })

    this.addChild(this.textSprite);
  }

  public set text(value: string) {
    this.textSprite.text = value;
  }

  update(): void {
  }

  customDestroyLogic(): void {}
}
