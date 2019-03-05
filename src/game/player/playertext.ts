import { TextEntity } from "../textentity";
import { GameState } from "../state";
import { Player } from "./player";

export class PlayerText extends TextEntity {
  player: Player;

  constructor(state: GameState, player: Player) {
    super(state, player, "");

    this.player = player;
  }

  update(): void {
    const cell = this.state.world.getCellAt(this.player.worldX, this.player.worldY);

    if (cell.type.name === "housemat") {
      this.text = "X: Enter";
    } else {
      this.text = "";
    }

    this.x = -this.width / 2;
    this.y = -20;
  }
}