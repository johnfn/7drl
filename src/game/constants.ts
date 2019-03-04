export class C {
  public static SCREEN_WIDTH  = 800;
  public static SCREEN_HEIGHT = 600;

  public static TILE_WIDTH  = 32;
  public static TILE_HEIGHT = 32;

  public static WORLD_HEIGHT_IN_CELLS = 31;
  public static WORLD_WIDTH_IN_CELLS  = 31;

  public static CORE_ITEMS = [
    'shield', // used to light something on FIRE
    //'earth', // use a giant metal spoon for cooking. also can dig a hole or something
    //'water', // flippers? alternatively, watering can?
    'hookshot' // associated with AIR ? 
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