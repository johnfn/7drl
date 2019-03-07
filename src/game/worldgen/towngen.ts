import { Chunk, genChunkCells as genEmptyChunkCells, Building, GridCell } from "./worldgen";
import { Rect } from "../rect";
import { Util } from "../util";
import { C } from "../constants";
import { Point } from "../point";
import { GoodMap } from "../util/goodmap";

type PointAndDistance = {
  point: Point;
  distance: number;
}

function getNeighboringPoints(point: Point, chunk: Chunk): Point[] {
  return [
    [ 1,  0],
    [-1,  0],
    [ 0,  1],
    [ 0, -1],
  ].map(([dx, dy]) => 
    new Point({ x: point.x + dx, y: point.y + dy })
  ).filter(point => chunk.rect.contains(point))
}

export function pathfind_any(start: Point, stop: Point, getNeighboringPoints: (point: Point) => Point[], isCollision: (point: Point) => boolean): Point[] {
  const prev = new GoodMap<Point, PointAndDistance | null>();
  let edge: PointAndDistance[] = [{ point: start, distance: 0 }];

  prev.set(start, null);

  let found = false;

  while (edge.length > 0) {
    edge = edge.sort((a, b) => b.point.taxicabDistance(stop) - a.point.taxicabDistance(stop));

    const current = edge.pop()!;

    if (current.point.x === stop.x && current.point.y === stop.y) { found = true; break; }

    const neighbors = getNeighboringPoints(current.point);

    for (const next of neighbors) {
      if (isCollision(next)) { continue; }

      if (!prev.has(next)) {
        edge.push({ point: next, distance: current.distance + 1 });
      }

      if (
        !prev.has(next) ||
        (prev.has(next) && prev.get(next) !== null && prev.get(next)!.distance > current.distance + 1)
      ) {
        prev.set(next, current);
      }
    }
  }

  const path = [];
  let currentPointInPath = stop;

  if (found) {
    while (true) {
      path.push(currentPointInPath);

      if (prev.get(currentPointInPath) !== null) {
        currentPointInPath = prev.get(currentPointInPath)!.point;
      } else {
        break;
      }
    }
  }

  return path;
}

// TODO improve to use A*
export function pathfind(start: Point, stop: Point, chunk: Chunk, isCollision: (cell: GridCell) => boolean): Point[] {
    return pathfind_any(start, stop, p => getNeighboringPoints(p, chunk), p => isCollision(chunk.cells[p.x][p.y]));
}

export function addStartingCityChunk(chunks: Chunk[][]): void {
  const chunk = chunks[0][0];

  // houses
  // shops
  // NPCs
  // trees
  // water (bridges?)
  // paths
  // cliffs???

  const townHeightInCells = C.CHUNK_SIZE_IN_TILES;
  const townWidthInCells  = C.CHUNK_SIZE_IN_TILES;
  const numBuildings      = 3;

  chunk.cells = genEmptyChunkCells(chunk);

  // generate some buildings

  let buildings: Building[] = [];

  for (let i = 0; i < numBuildings; i++) {
    let tries = 0;

    while (++tries < 100) {
      const newBuilding: Building = {
        rect: new Rect({
          x   : Util.RandomRange(5, townWidthInCells  - 5),
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
        chunk.cells[i][j] = {
          type       : { name: "house", building },
          height     : chunk.height,
          biome      : "foo",
          difficulty : 0,
          unlockStage: 0,
          isWall     : true,
        };
      }
    }

    chunk.cells[building.rect.left + 1][building.rect.bottom] = {
      type       : { name: "housemat", building },
      height     : chunk.height,
      biome      : "foo",
      isWall     : false,
      difficulty : 0,
      unlockStage: 0,
    };

    chunk.cells[building.rect.left + 2][building.rect.bottom] = {
      type       : { name: "housemat", building },
      height     : chunk.height,
      biome      : "foo",
      difficulty : 0,
      unlockStage: 0,
      isWall     : false,
    };
  }

  // add a path (mostly for aesthetics)

  let pointsToVisit: Point[] = [
    ...buildings.map(building => new Point({ 
      x: building.rect.x + 2, 
      y: building.rect.bottom + 1,
    })),
  ];

  pointsToVisit = pointsToVisit.filter(p => chunk.rect.contains(p));

  const isCollision = (cell: GridCell) => cell.isWall || cell.type.name === "housemat";

  let line = pathfind(
    new Point({ x: Math.floor(C.CHUNK_SIZE_IN_TILES / 2) , y: 0 }),
    new Point({ x: Math.floor(C.CHUNK_SIZE_IN_TILES / 2) , y: C.CHUNK_SIZE_IN_TILES - 1 }),
    chunk,
    isCollision
  );

  for (const point of pointsToVisit) {
    const closestPointOnLine = Util.minBy(line, x => x.taxicabDistance(point))!;

    line = [
      ...line,
      ...pathfind(point, closestPointOnLine, chunk, isCollision),
    ]
  }

  for (const p of line) {
    chunk.cells[p.x][p.y] = {
      type       : { name: "path" },
      height     : chunk.height,
      biome      : "foo",
      difficulty : 0,
      unlockStage: 0,
      isWall     : false,
    };
  }

  chunks[0][0] = {
    type: { name: "starting city" },
    height: chunk.height,
    level : 0,
    x     : chunk.x,
    y     : chunk.y,
    cells : chunk.cells,
    rect  : chunk.rect,
  };
}
