import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { Util } from "./util";
import { Rect } from "./rect";

type Building = { 
  rect: Rect;
  type: "inn" | "house";
};

type GridCell =
  | { type: "grass" }
  | { type: "house", building: Building }
  | { type: "tree" }
  | { type: "water" }

type WorldScreen = {
  width : number;
  height: number;
  cells : GridCell[][];
}

type WorldMap = {
  cells: WorldScreen[][];
}

export class World extends Entity {
  graphics: Graphics;
  map     : WorldMap;

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
    });

    this.graphics = new Graphics();
    
    this.addChild(this.graphics);

    this.map = this.generateMap();
    
    this.drawWorldScreen(this.map.cells[0][0]);
  }

  generateMap(): WorldMap {
    const town = this.generateTown();

    return {
      cells: [[town]],
    };
  }

  generateTown(): WorldScreen {
    // houses
    // shops
    // NPCs
    // trees
    // water (bridges?)
    // paths
    // cliffs???

    const townHeightInCells = 50;
    const townWidthInCells  = 50;
    const numBuildings      = 3;

    const map: GridCell[][] = [];

    for (let i = 0; i < townHeightInCells; i++) {
      map[i] = [];

      for (let j = 0; j < townWidthInCells; j++) {
        map[i][j] = { type: "grass" };
      }
    }

    // generate some buildings

    let buildings: Building[] = [];

    for (let i = 0; i < numBuildings; i++) {
      let tries = 0;

      while (++tries < 100) {
        const newBuilding: Building = {
          rect: new Rect({
            x   : Util.RandomRange(5, townWidthInCells - 5),
            y   : Util.RandomRange(5, townHeightInCells - 5),
            w   : 4,
            h   : 2,
          }),
          type: "house",
        };

        for (const existingBuilding of buildings) {
          if (existingBuilding.rect.intersects(existingBuilding.rect, { edgesOnlyIsAnIntersection: true })) {
            continue;
          }
        }

        buildings.push(newBuilding);
        break;
      }
    }

    // add buildings to map 

    for (const building of buildings) {
      for (let i = building.rect.left; i < building.rect.right; i++) {
        for (let j = building.rect.top; j < building.rect.bottom; j++) {
          map[i][j] = {
            type    : "house",
            building: building,
          };
        }
      }
    }

    ////////////////////////////////////////////////////////////////////

    return {
      width : townWidthInCells,
      height: townHeightInCells,
      cells : map,
    };
  }

  drawWorldScreen(screen: WorldScreen): void {
    // draw town

    for (let i = 0; i < screen.height; i++) {
      for (let j = 0; j < screen.width; j++) {
        const cell = screen.cells[i][j];
        
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