import { Rect } from "./rect";
import { C } from "./constants";
import { GameState } from "./state";

export class Camera {
  width        : number;
  height       : number;

  desiredStageX: number = 0;
  desiredStageY: number = 0;

  bounds: Rect;

  get x(): number {
    return this.centerX - this.width / 2;
  }

  get right(): number {
    return this.centerX + this.width / 2;
  }

  get y(): number {
    return this.centerY - this.height / 2;
  }

  get bottom(): number {
    return this.centerY + this.height / 2;
  }

  setX(value: number) {
    if (value < this.bounds.x) { value = this.bounds.x; }
    if (value >= this.bounds.right - this.width) { value = this.bounds.right - this.width; }

    this.desiredStageX = -value;
  }

  setY(value: number) {
    if (value < this.bounds.y) { value = this.bounds.y; }
    if (value >= this.bounds.bottom - this.height) { value = this.bounds.bottom - this.height; }

    this.desiredStageY = -value;
  }

  set centerX(value: number) {
    this.setX(value - this.width / 2);
  }

  get centerX(): number {
    return -this.desiredStageX + this.width / 2;
  }

  set centerY(value: number) {
    this.setY(value - this.height / 2);
  }

  get centerY(): number {
    return -this.desiredStageY + this.height / 2;
  }

  constructor() {
    this.width  = C.SCREEN_WIDTH;
    this.height = C.SCREEN_HEIGHT;
    this.desiredStageX = 0;
    this.desiredStageY = 0;

    this.bounds = new Rect({ 
      x: 0, 
      y: 0, 
      w: 1000, // TODO calculate from world
      h: 1000,
    });
  }

  update(state: GameState) {
    const activeScreen = state.world.getActiveWorldScreen();

    if (this.bounds.w !== activeScreen.pixelWidth || this.bounds.h !== activeScreen.pixelHeight) {
      this.bounds = this.bounds
        .withWidth(state.world.getActiveWorldScreen().pixelWidth)
        .withHeight(state.world.getActiveWorldScreen().pixelHeight);
    }
 
    state.stage.x = this.desiredStageX;
    state.stage.y = this.desiredStageY;
  }
}
