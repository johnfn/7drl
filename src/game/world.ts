import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { Util } from "./util";
import { Rect } from "./rect";
import { C } from "./constants";
import { Monster } from "./monster";
import { Color } from "./color";
import { IPoint } from "./point";
import { generateWorldChunks, Level, Chunk } from "./worldgen/genchunks";

type Building = { 
  rect: Rect;
  type: "inn" | "house";
};

type Biome = "foo" | "bar";

type GridCell = {
  height: number; // some abstract concept for generating non-boring cells
  biome: Biome; // what class/theme of monsters are generated?
  difficulty: number; // how hard the monsters are in there. correlated with level
  unlockStage: Level;  // how many key items are needed
  type: 
    | { name: "grass" }
    | { name: "house", building: Building }
    | { name: "tree" }
    | { name: "water" };
}
// TODO(bowei): maybe we don't want hard screen transitions

type WorldMap = {
  cells : GridCell[][];
}

export class World extends Entity {
  graphics: Graphics;
  map     : WorldMap;
  debug   : Graphics;
  chunks !: Chunk[][];

  constructor(state: GameState) {
    super({
      state,
      parent: state.app.stage,
    });

    this.graphics = new Graphics();
    
    this.addChild(this.graphics);

    this.debug    = new Graphics();
    this.addChild(this.debug);

    this.debug.visible = false;

    this.map = this.generateMap();
    
    this.drawWorldScreen(0, 0, 50, 50);
    
    this.debugDraw();
  }

  getActiveWorldScreen(): Rect {
    const player = this.state.player;

    return new Rect({
      x: Math.floor(player.mapX / C.SCREEN_SIZE_IN_TILES) * C.SCREEN_SIZE_IN_TILES * C.TILE_SIZE,
      y: Math.floor(player.mapY / C.SCREEN_SIZE_IN_TILES) * C.SCREEN_SIZE_IN_TILES * C.TILE_SIZE,
      w: C.SCREEN_SIZE_IN_TILES * C.TILE_SIZE,
      h: C.SCREEN_SIZE_IN_TILES * C.TILE_SIZE
    });
  }

  generateMap(): WorldMap {
    const worldMap: WorldMap = {
      cells: [],
    };

    for (let i = 0; i < C.MAP_SIZE_IN_TILES; i++) {
      worldMap.cells[i] = [];

      for (let j = 0; j < C.MAP_SIZE_IN_TILES; j++) {
        worldMap.cells[i][j] = { 
          type       : { name: "grass" },
          // TODO(bowei): generate biomes please
          biome      : "foo",
          height     : 0.5,
          // TODO(bowei): un-hardcode starting city here
          difficulty : (i == 0 && j == 0) ? 0 : 1,
          unlockStage: 0,
        };
      }
    }

    this.chunks = generateWorldChunks(33);

    return worldMap;
  }

  debugDraw(): void {
    for (let i = 0; i < C.WORLD_SIZE_IN_CELLS; i += 1) {
      for (let j = 0; j < C.WORLD_SIZE_IN_CELLS; j += 1) {
        const chunk = this.chunks[i][j];
        const h      = chunk.height;

        if (chunk.type.name === "starting city") {
          this.debug.beginFill(new Color(255, 0, 0).toNumber());
        } else if (chunk.level === 1) {
          this.debug.beginFill(new Color(200, 0, 0).toNumber());
        } else if (chunk.level === 2) {
          this.debug.beginFill(new Color(150, 0, 0).toNumber());
        } else if (chunk.level === 3) {
          this.debug.beginFill(new Color(100, 0, 0).toNumber());
        } else {
          this.debug.beginFill(new Color(h * 255, h * 255, h * 255).toNumber());
        }

        this.debug.drawRect(i * 20, j * 20, 15, 15);
      }
    }
  }

  /*
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
        map[i][j] = { type: { name: "grass" } };
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
      cellHeight : townHeightInCells,
      pixelWidth : townWidthInCells * C.TILE_SIZE,
      pixelHeight: townHeightInCells * C.TILE_HEIGHT,
      worldX     : x,
      worldY     : y,
      height     : 0,
      cells      : map,
    };
  }
  */

  drawWorldScreen(worldX: number, worldY: number, width = 50, height = 50): void {
    // draw town

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = this.map.cells[worldX + i][worldY + j];
        
        if (cell.type.name === "grass") {
          this.graphics.beginFill(0x00ff00);
        } else if (cell.type.name === "house") {
          this.graphics.beginFill(0x000000);
        } else if (cell.type.name === "tree") {
          this.graphics.beginFill(0x99ff99);
        } else if (cell.type.name === "water") {
          this.graphics.beginFill(0x0000ff);
        }

        this.graphics.drawRect(i * 32, j * 32, 32, 32);
      }
    }
  }

  generateMonsters(state: GameState): void {
    state.monsters = [];
    for (let i = 0 ; i < C.MAP_SIZE_IN_TILES; i++) {
      for (let j = 0 ; j < C.MAP_SIZE_IN_TILES; j++) {
        let difficulty = this.map.cells[i][j].difficulty
        this.generateMonstersByCell(state, this.map.cells[i][j], {x: i , y: j} );
      }
    }

    // generate some random mosters
    // hmmm how many monsters?
    //const monsterDensity = [1./8, 1./16];
    //let area = C.SCREEN_SIZE_IN_TILES * C.SCREEN_SIZE_IN_TILES;
    //for (let i = 0; i < Util.RandomRange(area * monsterDensity[0], area * monsterDensity[1]); i++) {
    //  let pos = { x: Util.RandomRange(0, 50), y: Util.RandomRange(0, 50) };
    //  if (!state.getMonsterAt(pos)) {
    //    state.monsters.push(new Monster(state, pos));
    //  }
    //}
  }

  generateMonstersByCell(state: GameState, cell: GridCell, position: IPoint): void {
    let monsterDensity = 1./80;
    if (cell.difficulty == 0) {
      monsterDensity = 0;
    }
    if (cell.type.name == 'water') {
      monsterDensity = 0;
    }
    if (Math.random() < monsterDensity) {
      // create a monster here
      state.monsters.push(new Monster(state, position));
    }
  }

  update() {
    if (this.state.keyboard.justDown.D) {
      this.debug.visible = !this.debug.visible;
    }
  }

  customDestroyLogic() { }
}