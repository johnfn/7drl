export class C {
  public static CANVAS_BACKGROUND_COLOR = 0xFFFFFF ;

  /**
   * Width or height of number of visible tiles on your screen.
   */
  public static WINDOW_SIZE_IN_TILES = 30;

  /**
   * Width of entire game world in tiles.
   */
  //public static MAP_SIZE_IN_TILES = 500; // deprectaed, use WORLD_SIZE_IN_CHUNKS * CHUNK_SIZE_IN_TILES

  /**
   * Size of a single map chunk in tiles.
   */
  public static CHUNK_SIZE_IN_TILES = 30;

  /**
   * Size of a single tile in pixels.
   */
  public static TILE_SIZE = 32;

  /**
   * Dimensions of the game window.
   */
  public static GAME_WIDTH  = Math.min(window.screen.availWidth || window.screen.width || 800, 960)
  public static GAME_HEIGHT = Math.min(window.screen.availHeight || window.screen.height || 600, 960)

  /**
   * Dimension of the entire world in chunks.
   */
  public static WORLD_SIZE_IN_CHUNKS = 31;

  /**
   * List of key items used to unlock areas. WIP
   */
  public static CORE_ITEMS = [
    'shield', // used to light something on FIRE. also can block attacks. also can fry eggs
    'gauntlets', // gives a strength boost in combat. also can be used to climb cliffs. also useful in powderizing some materials.
    'helmet', // iron helmet which gives head protection. also used as a bucket to carry water. also can milk cows.
    'hookshot' // used to fly across some areas. also can move enemies towards you. also can harpoon fish.
    // --- planned for future release --- //
    // 'tutorial' // 'navi' // some annoying pixie that gives you hints like what items you should use
    // 'enemies' // 'time-turner' // undo one move
    // 'items' // apple' // dont use this in any stupid way, otherwise it breaks and you lose the run
    // 'map' // 'teleporter' // temporary teleport
    // have "conducts" ?
    // 'health' // 'medicine bottle' // after picking this up, you have a health threshold, cant go below that
    // 'pacifist'
    // 'homeless' // a stinky shoe or an ugly hat. can't go back to town ?
    // see https://brogue.fandom.com/wiki/Feats, https://nethackwiki.com/wiki/Conduct
  ];

}
