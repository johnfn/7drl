import { Graphics } from "pixi.js";

// TODO(bowei): make this an abstract class or something. maybe not though. not sure
// monster qualities: some default qualities
// (move speed, attack damage, number of attacks, hp, exp, drops)
// some adjectives: 
// movement AI types: idle, cowardly, wandering, mean
// default states: idle, aggro. default is (idle/aggro) -> (wandering/mean)
// additional qualities: fast?, flying?, flocking?, dangerous?
// special abilities, status? LATER
// * FIRST AREA : yellow/brown? sorta dingy. Old farmlands around the town. Tutorial?
// Old Scarecrow    (idle/idle) // doesnt move when idle, doesnt move when angered. atk=0
// Gray slime       (patrolling/patrolling) // set movement pattern
// Brown slime      (wandering/wandering) // doesnt anger. maybe only move diagonally?
// Sleepy rat       (idle/mean) // starts out sleeping
// * SECOND AREA : some more forest. still kinda farmy
// Brown spider     () // just the default, wandering/mean
// Honey badger     (dangerous, mean/mean/mean) // unusually powerful for this level, mainly because the 3rd anger state has a lot of extra damage
// Old Scarecrow?   (dangerous, mean/mean) // zero move but will initiate on player if within range
// Grimdark farmhand (patrolling/mean) // has a set movement pattern. better to avoid him
// Some ants        (flocking) // comes in packs
// Grass snake      (invisible, idle/mean)
// Rabid rabbit     (cowardly/mean)
// Large bat        (flying, wandering/wandering)
// Hungry fox       (mean/mean)
// Wild goose       (flocking, mean/mean)
// Wolf             (flocking, dangerous, mean/mean) // dangerous

export type MonsterState = "idle" | "aggro";
export type MONSTER_MOVEMENT_AI = "sessile" | "cowardly" | "wandering" | "mean" | "patrolling"
export type MONSTER_ADJECTIVES = "fast" | "flying" | "flocking"

export type Species = {
    behavior: {[K in MonsterState]?:  MONSTER_MOVEMENT_AI},
    baseAttack: number,
    baseMaxHealth: number,
    baseExp: number,
    // TODO(bowei): implement item AND money drops
    //drops: number,
    // TODO(bowei): procedurally generate this name? so make like "rabbitdogs" and like "batcats"
    // that way the meat they drop can also be randomized. so we can have randomized recipes. for randomized crafting.
    // TODO(bowei): alternatively just have drops be immediately usable and randomized effects per tier.
    shortName: string,
    longName?: string,
    createGraphics: () => Graphics
};

function coloredSquareGenerator(colorCode: number) {
  return () => {
    const graphics = new Graphics();
    graphics.beginFill(colorCode);
    graphics.drawRect(0, 0, 24, 24);
    graphics.x = 4;
    graphics.y = 4;
    return graphics;
  }
}

export class MONSTER_CLASSES {
  public static scarecrow_0: Species = {
    behavior: {"idle": "sessile", "aggro": "sessile"},
    baseAttack: 0,
    baseMaxHealth: 3,
    baseExp: 1,
    shortName: 'Old Scarecrow',
    createGraphics: coloredSquareGenerator(0xFF00FF)
  };
  public static scarecrow_1: Species = {
    behavior: {"idle": "sessile", "aggro": "sessile"},
    baseAttack: 1,
    baseMaxHealth: 3,
    baseExp: 0,
    shortName: 'Training Dummy',
    createGraphics: coloredSquareGenerator(0x8F80FF)
  };
  public static animal_0: Species = {
    behavior: {"idle": "wandering", "aggro": "wandering"},
    baseAttack: 1,
    baseMaxHealth: 3,
    baseExp: 0,
    shortName: 'Green Slime',
    createGraphics: coloredSquareGenerator(0x006000)
  };
}
