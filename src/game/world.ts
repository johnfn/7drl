import { Entity } from "./entity";
import { GameState } from "./state";
import { Graphics } from "pixi.js";
import { Rect } from "./rect";
import { C } from "./constants";
import { Monster } from "./monsters/monster";
import { MONSTER_CLASSES } from "./monsters/monstertypes";
import { Color } from "./color";
import { IPoint } from "./point";
import { genWorld, Level, Chunk, GridCell } from "./worldgen/worldgen";
import { Util } from "./util";

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

    this.map = this.generateMap(C.WORLD_SIZE_IN_CHUNKS);
    
    this.drawWorldScreen({x: 0,y: 0});
    
    this.debugDraw();
    this.generateMonsters();
  }

  getActiveWorldScreen(): Rect {
    const player = this.state.player;

    return new Rect({
      x: Math.floor(player.worldX / C.WINDOW_SIZE_IN_TILES) * C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      y: Math.floor(player.worldY / C.WINDOW_SIZE_IN_TILES) * C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      w: C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE,
      h: C.WINDOW_SIZE_IN_TILES * C.TILE_SIZE
    });
  }

  generateMap(size_in_chunks: number): WorldMap {
    //this.chunks = genWorld(33);
    this.chunks = genWorld(size_in_chunks + 2);

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
    for (let i = 0; i < C.WORLD_SIZE_IN_CHUNKS; i += 1) {
      for (let j = 0; j < C.WORLD_SIZE_IN_CHUNKS; j += 1) {
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

  drawWorldScreen({ x: worldX, y: worldY }: IPoint): void {
    // draw town

    for (let i = 0; i < C.CHUNK_SIZE_IN_TILES; i++) {
      for (let j = 0; j < C.CHUNK_SIZE_IN_TILES; j++) {
        const cell = this.map.cells[worldX + i][worldY + j];
        
        if (cell.type.name === "grass") {
          this.graphics.beginFill(0x00ff00);
        } else if (cell.type.name === "house") {
          this.graphics.beginFill(0x000000);
        } else if (cell.type.name === "housemat") {
          this.graphics.beginFill(0xcccccc);
        } else if (cell.type.name === "tree") {
          this.graphics.beginFill(0x99ff99);
        } else if (cell.type.name === "water") {
          this.graphics.beginFill(0x0000ff);
        } else if (cell.type.name === "path") {
          this.graphics.beginFill(0xbbbb66);
        } else {
          Util.AssertNever(cell.type)
        }

        this.graphics.drawRect(i * 32, j * 32, 32, 32);
      }
    }
  }

  isAWall(worldX: number, worldY: number): boolean {
    return this.map.cells[worldX][worldY].isWall;
  }

  getCellAt(worldX: number, worldY: number): GridCell {
    return this.map.cells[worldX][worldY];
  }

  generateMonsters(): void {
    for (let i = 0 ; i < this.map.cells.length; i++) {
      for (let j = 0 ; j < this.map.cells[i].length; j++) {
        let difficulty = this.map.cells[i][j].difficulty
        this.generateMonstersByCell(this.map.cells[i][j], {x: i , y: j} );
      }
    }
  }

  generateMonstersByCell(cell: GridCell, position: IPoint): void {
    let monsterDensity = 1 / 80;

    //if (cell.difficulty == 0) {
    //  monsterDensity = 0;
    //}

    //if (cell.type.name == 'water') {
    //  monsterDensity = 0;
    //}

    if (Math.random() < monsterDensity) {
      // create a monster here

      if (Math.random() < 0.33) {
        new Monster({state: this.state, position, species: MONSTER_CLASSES.scarecrow_0 });
      } else if (Math.random() < 0.5) {
        new Monster({state: this.state, position, species: MONSTER_CLASSES.scarecrow_1 });
      } else {
        new Monster({state: this.state, position, species: MONSTER_CLASSES.animal_0 });
      }
    }
  }

  update() {
    if (this.state.keyboard.justDown.D) {
      this.debug.visible = !this.debug.visible;
    }
  }

  customDestroyLogic() { }
}
 
