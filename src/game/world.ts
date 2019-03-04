import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { Util } from "./util";
import { Rect } from "./rect";
import { C } from "./constants";
import { Monster } from "./monster";
import { Color } from "./color";

type Building = { 
  rect: Rect;
  type: "inn" | "house";
};

type GridCell =
  | { type: "grass" }
  | { type: "house", building: Building }
  | { type: "tree" }
  | { type: "water" }
// TODO(bowei): maybe we don't want hard screen transitions

/**
 * A single screen in the world map.
 */
type WorldScreen = {
  cellWidth  : number;
  cellheight : number;
  pixelWidth : number;
  pixelHeight: number;
  worldX     : number;
  worldY     : number;
  height     : number;
  cells      : GridCell[][];
}

type WorldMap = {
  cells : WorldScreen[][];
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
    
    this.debugDraw();
  }

  getActiveWorldScreen(): WorldScreen {
    const player = this.state.player;

    return this.map.cells[player.worldX][player.worldY];
  }

  generateMap(): WorldMap {
    const worldMap: WorldMap = {
      cells: [],
    };

    for (let i = 0; i < 31; i++) {
      worldMap.cells[i] = [];

      for (let j = 0; j < 31; j++) {
        const cells: GridCell[][] = [];

        for (let k = 0; k < 50; k++) {
          cells[k] = [];

          for (let l = 0; l < 50; l++) {
            cells[k][l] = { type: "grass" };
          }
        }

        const screen: WorldScreen = {
          cellWidth  : 50,
          cellheight : 50,
          pixelWidth : 50 * C.TILE_WIDTH,
          pixelHeight: 50 * C.TILE_HEIGHT,
          worldX: i,
          worldY: j,
          height: 0,
          cells,
        };

        worldMap.cells[i][j] = screen; 
      }
    }

    for (let i = 0; i < C.WORLD_HEIGHT_IN_CELLS; i += 1) {
      for (let j = 0; j < C.WORLD_HEIGHT_IN_CELLS; j += 1) {
        worldMap.cells[i][j].height = 0.9;
      }
    }

    return worldMap;
  }

  debugDraw(): void {
    for (let i = 0; i < C.WORLD_HEIGHT_IN_CELLS; i += 1) {
      for (let j = 0; j < C.WORLD_HEIGHT_IN_CELLS; j += 1) {
        const screen = this.map.cells[i][j];
        const h = screen.height;

        console.log(h);

        this.graphics.beginFill(new Color(h * 255, h * 255, h * 255).toNumber());
        this.graphics.drawRect(i * 2, j * 2, 2, 2);
      }
    }
  }

  generateTown(x: number, y: number): WorldScreen {
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
      cellWidth  : townWidthInCells,
      cellheight : townHeightInCells,
      pixelWidth : townWidthInCells * C.TILE_WIDTH,
      pixelHeight: townHeightInCells * C.TILE_HEIGHT,
      worldX     : x,
      worldY     : y,
      height     : 0,
      cells      : map,
    };
  }

  drawWorldScreen(screen: WorldScreen): void {
    // draw town

    for (let i = 0; i < screen.cellheight; i++) {
      for (let j = 0; j < screen.cellWidth; j++) {
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

  generateMonsters(state: GameState): void {
    // generate some random mosters
    state.monsters = [];
    for (let i = 0; i < Util.RandomRange(5, 20); i++) {
      state.monsters.push(new Monster(state, {x: Util.RandomRange(0, 32), y: Util.RandomRange(0, 32)}));
    }
  }

  update() {
  }
}