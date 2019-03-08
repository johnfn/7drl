import { Entity } from "./entity";
import { GameState } from "./state";

export class Overlay extends Entity {
  constructor(props: {
    state: GameState;
  }) {
    super({
      state: props.state,
      parent: props.state.overlayStage
    });
  }

  update() { }

  customDestroyLogic() { }
}
