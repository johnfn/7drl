import { Util } from "../util";
import { addStartingCityChunk } from "./towngen";
import { C } from "../constants";
import { Rect } from "../rect";

export type Level = 0 | 1 | 2 | 3 | 4 | "unset";

export type Building = { 
  rect: Rect;
  type: "inn" | "house";
};

export type Biome = "foo" | "bar";

export type GridCell = {
  /** 
   * number from 0-1; adjacent cells will have similar height. could potentially
   * be used to calculate biome
   */
  height: number;

  /**
   * what class/theme of monsters are generated?
   */
  biome: Biome;

  /**
   * how hard the monsters are in there. correlated with level
   */
  difficulty: number;

  /**
   * how many key items are needed
   */
  unlockStage: Level;

  /**
   * Is this cell impassable?
   */
  isWall: boolean;

  type: 
    | { name: "grass" }
    | { name: "house", building: Building }
    | { name: "housemat", building: Building }
    | { name: "path" }
    | { name: "tree" }
    | { name: "water" };
}

export type Chunk = {
  height: number;
  level : Level;
  x     : number;
  y     : number;
  cells : GridCell[][];
  rect  : Rect;
  type  :
    | { name: "starting city" }
    | { name: "grassland" }
}


export function genWorld(size: number): Chunk[][] {
  const heights = generateHeights(size);
  const chunks  = heights.map((row, i) => row.map((v, j) => {
    const chunk: Chunk = { 
      height: v, 
      type  : { name: "grassland" },
      level : "unset",
      x     : i,
      y     : j,
      rect  : new Rect({ x: i, y: j, w: C.CHUNK_SIZE_IN_TILES, h: C.CHUNK_SIZE_IN_TILES }),
      cells : [],
    };

    return chunk;
  }));

  addStartingCityChunk(chunks);
  addChunksOfLevel(chunks, 1, 20);
  addChunksOfLevel(chunks, 2, 40);
  addChunksOfLevel(chunks, 3, 60);
  addChunksOfLevel(chunks, 4, 40);

  return chunks;
}

export function genChunkCells(chunk: Chunk): GridCell[][] {
  const cells: GridCell[][] = [];

  for (let i = 0; i < C.CHUNK_SIZE_IN_TILES; i++) {
    cells[i] = [];

    for (let j = 0; j < C.CHUNK_SIZE_IN_TILES; j++) {
      cells[i][j] = { 
        type       : { name: "grass" },
        height     : chunk.height,
        biome      : "foo",
        difficulty : 0,
        unlockStage: 0,
        isWall     : false,
      };
    }
  }

  return cells;
}

function roundToPow2Plus1(size: number): number {
    return 33;
}

// Generate a size x size array of perlin noise between 0 and 1
// size must be power of 2 plus 1
function generateHeights(lsize: number): number[][] {
  const size: number = roundToPow2Plus1(lsize);
  let result: number[][] = [];

  for (let i = 0; i < size; i++) {
    result[i] = [];

    for (let j = 0; j < size; j++) {
      result[i][j] = 0;
    }
  }

  result[0       ][0       ] = Math.random();
  result[0       ][size - 1] = Math.random();
  result[size - 1][0       ] = Math.random();
  result[size - 1][size - 1] = Math.random();

  let stepSize   = size - 1;
  let randomness = 0.4;

  const nudge = (val: number) => {
    const res = val + (randomness * Math.random() - randomness / 2);

    if (res > 1) return 1;
    if (res < 0) return 0;

    return res;
  }

  while (stepSize > 1) {
    // Do diamond step

    for (let x = 0; x < size- 1; x += stepSize) {
      for (let y = 0; y < size - 1; y += stepSize) {

        result[x + stepSize / 2][y + stepSize / 2] = nudge((
          result[x           ][y           ] +
          result[x + stepSize][y           ] +
          result[x           ][y + stepSize] +
          result[x + stepSize][y + stepSize]
        ) / 4);
      }
    }

    // Do square step

    const halfStepSize = stepSize / 2;

    for (let x = 0; x < size; x += halfStepSize) {
      for (let y = 0; y < size; y += halfStepSize) {
        const xi = x / (stepSize / 2);
        const yi = y / (stepSize / 2);

        if ((xi + yi) % 2 === 0) continue;

        const coordinates: number[] = ([
          [x               , y + halfStepSize],
          [x               , y - halfStepSize],
          [x + halfStepSize, y               ],
          [x - halfStepSize, y               ],
        ] as [number, number][])
          .filter(([x, y]) => x >= 0 && x < size && y >= 0 && y < size)
          .map(([x, y]) => result[x][y]);

        result[x][y] = nudge((coordinates
          .reduce((x, y) => x + y, 0) / coordinates.length
        ));
      }
    }

    stepSize /= 2;
  }

  // normalize all values

  const values = Util.Flatten(result);
  const min    = Math.min(...values);
  const max    = Math.max(...values);

  result = result.map(row => row.map(val => {
    return (val - min) / (max - min);
  }));

  return result;
}

function getNeighboringChunks(x: number, y: number, chunks: Chunk[][]): Chunk[] {
  const dxdy = [
    [ 0,  1],
    [ 0, -1],
    [ 1,  0],
    [-1,  0],
  ];

  let result: Chunk[] = [];

  for (const [dx, dy] of dxdy) {
    const nx = dx + x;
    const ny = dy + y;

    if (nx < 0 || ny < 0 || nx > chunks.length || ny > chunks[0].length) { continue; }

    result.push(chunks[nx][ny]);
  }

  return result;
}

function addChunksOfLevel(chunks: Chunk[][], newLevel: Level, count: number): void {
  const prevLevelChunks = Util.Flatten(chunks).filter(c => c.level === (newLevel as number - 1) );

  const seen = new Set<Chunk>();
  let   edge = Util.Flatten(prevLevelChunks.map(chunk => getNeighboringChunks(chunk.x, chunk.y, chunks)));
  const newChunks: Chunk[] = [];

  while (newChunks.length < count) {
    const next = edge.splice(Util.Random(edge.length), 1)[0];

    if (next.level !== "unset") { continue; }

    if (!seen.has(next)) {
      seen.add(next);
      newChunks.push(next);

      edge = [...edge, ...getNeighboringChunks(next.x, next.y, chunks)];
    }
  }

  for (let chunk of newChunks) {
    chunk.level = newLevel;
  }
}
