import { Chunk, genChunkCells as genEmptyChunkCells } from "./genworld";
import { GridCell, Building } from "../world";
import { Rect } from "../rect";
import { Util } from "../util";
import { C } from "../constants";

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

  const cells = genEmptyChunkCells(chunk);

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
        cells[i][j] = {
          type       : { name: "house", building },
          height     : chunk.height,
          biome      : "foo",
          difficulty : 0,
          unlockStage: 0,
        };
      }
    }
  }

  chunks[0][0] = {
    type: { name: "starting city" },
    height: chunk.height,
    level : 0,
    x     : chunk.x,
    y     : chunk.y,
    cells : cells,
  };
}
