import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";

type GridCell =
  | { type: "grass" }
  | { type: "house" }
  | { type: "tree" }
  | { type: "water" }

export class World extends Entity {
  graphics: Graphics;

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
    });

    this.graphics = new Graphics();
    
    this.addChild(this.graphics);

    this.generateTown();
  }

  generateTown() {
    // houses
    // shops
    // NPCs
    // trees
    // water (bridges?)
    // paths
    // cliffs???

    const townHeightInCells = 50;
    const townWidthInCells  = 50;
    const map: GridCell[][] = [];

    for (let i = 0; i < townHeightInCells; i++) {
      map[i] = [];

      for (let j = 0; j < townWidthInCells; j++) {
        map[i][j] = { type: "grass" }
      }
    }

    ////////////////////////////////////////////////////////////////////

    // draw town

    for (let i = 0; i < townHeightInCells; i++) {
      for (let j = 0; j < townWidthInCells; j++) {
        const cell = map[i][j];
        
        if (cell.type === "grass") {
          this.graphics.beginFill(0x00ff00);
        } else if (cell.type === "house") {
          this.graphics.beginFill(0x000000);
        } else if (cell.type === "tree") {
          this.graphics.beginFill(0x99ff99);
        } else if (cell.type === "water") {
          this.graphics.beginFill(0x0000ff);
        }

        this.graphics.drawRect(i * 32, j * 32, 32, 32);
      }
    }
  }

  update() {
  }
}