import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { Rect } from "./rect";
import { C } from "./constants";
import { Monster } from "./monsters/monster";
import { Color } from "./color";
import { IPoint } from "./point";
import { genWorld, Level, Chunk } from "./worldgen/genworld";

export type Building = { 
  rect: Rect;
  type: "inn" | "house";
};

type Biome = "foo" | "bar";

export type GridCell = {
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

  /**
   * All of the data in the entire world
   */
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
    
    this.drawWorldScreen(0, 0);
    
    this.debugDraw();
  }

  getActiveWorldScreen(): Rect {
    const player = this.state.player;

    return new Rect({
      x: Math.floor(player.mapX / C.WINDOW_SIZE_IN_TILES) * C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      y: Math.floor(player.mapY / C.WINDOW_SIZE_IN_TILES) * C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      w: C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      h: C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE
    });
  }

  generateMap(): WorldMap {
    this.chunks = genWorld(33);

    const worldMap: WorldMap = {
      cells: [],
    };

    // flatten chunks of cells into one huge 2d grid of all cells ever.

    for (let i = 0; i < this.chunks.length; i++) {
      for (let j = 0; j < this.chunks[i].length; j++) {
        const cells = this.chunks[i][j].cells;

        for (let k = 0; k < cells.length; k++) {
          worldMap.cells[i * cells.length + k] = [];

          for (let l = 0; l < cells.length; l++) {
            worldMap.cells[i * cells.length + k][j * cells.length + l] = cells[k][l];
          }
        }
      }
    }

    return worldMap;
  }

  debugDraw(): void {
    for (let i = 0; i < C.WORLD_SIZE_IN_SCREENS; i += 1) {
      for (let j = 0; j < C.WORLD_SIZE_IN_SCREENS; j += 1) {
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

  drawWorldScreen(worldX: number, worldY: number): void {
    // draw town

    for (let i = 0; i < C.CHUNK_SIZE_IN_TILES; i++) {
      for (let j = 0; j < C.CHUNK_SIZE_IN_TILES; j++) {
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
    for (let i = 0 ; i < this.map.cells.length; i++) {
      for (let j = 0 ; j < this.map.cells[i].length; j++) {
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
    let monsterDensity = 1 / 80;

    if (cell.difficulty == 0) {
      monsterDensity = 0;
    }

    if (cell.type.name == 'water') {
      monsterDensity = 0;
    }

    if (Math.random() < monsterDensity) {
      // create a monster here

      new Monster(state, position);
    }
  }

  update() {
    if (this.state.keyboard.justDown.D) {
      this.debug.visible = !this.debug.visible;
    }
  }

  customDestroyLogic() { }
}
