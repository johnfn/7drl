import { Graphics, Text, Ticker } from "pixi.js";
import { Entity } from "./entity";
import { GameState } from "./state";
import { C } from "./constants";

export class Overlay extends Entity {
  ticker: Ticker;
  fpsText: Text;

  constructor(props: {
    state: GameState;
  }) {
    super({
      state: props.state,
      parent: props.state.overlayStage
    });

    const textStyle = {}; //{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}
    this.fpsText = new Text('hello world', textStyle);
    this.fpsText.anchor.set(1.0, 0.0); // right align
    this.addChild(this.fpsText);

    this.ticker = Ticker.shared;
  }

  update() {
    this.fpsText.text = 'FPS: ' + (Math.round(this.ticker.FPS * 10)/10).toString() + '\n';
    this.fpsText.x = C.GAME_WIDTH;
  }

  customDestroyLogic() { }
}
