class KeyInfo {
  [key: string]: boolean;

  static Keys: string[] =
  "QWERTYUIOPASDFGHJKLZXCVBNM".split("")
    .concat("Spacebar")
    .concat("Up")
    .concat("Down")
    .concat("Left")
    .concat("Right");

  Q       : boolean = false;
  W       : boolean = false;
  E       : boolean = false;
  R       : boolean = false;
  T       : boolean = false;
  Y       : boolean = false;
  U       : boolean = false;
  I       : boolean = false;
  O       : boolean = false;
  P       : boolean = false;
  A       : boolean = false;
  S       : boolean = false;
  D       : boolean = false;
  F       : boolean = false;
  G       : boolean = false;
  H       : boolean = false;
  J       : boolean = false;
  K       : boolean = false;
  L       : boolean = false;
  Z       : boolean = false;
  X       : boolean = false;
  C       : boolean = false;
  V       : boolean = false;
  B       : boolean = false;
  N       : boolean = false;
  M       : boolean = false;

  Up      : boolean = false;
  Down    : boolean = false;
  Left    : boolean = false;
  Right   : boolean = false;
  Spacebar: boolean = false;
}

interface QueuedKeyboardEvent {
  isDown: boolean;
  event : KeyboardEvent;
}

export class Keyboard {
  public down     = new KeyInfo();
  public justDown = new KeyInfo();

  private _queuedEvents: QueuedKeyboardEvent[] = [];

  constructor() {
    addEventListener("keydown", e => this.keyDown(e), false);
    addEventListener("keyup",   e => this.keyUp(e),   false);
  }

  private keyUp(e: KeyboardEvent) {
    // Since events happen asynchronously, we simply queue them up to be
    // processed on the next update cycle.
    this._queuedEvents.push({ event: e, isDown: false });
  }

  private keyDown(e: KeyboardEvent) {
    this._queuedEvents.push({ event: e, isDown: true });
  }

  private eventToKey(event: KeyboardEvent): string {
    const number = event.keyCode || event.which;
    let str: string;

    switch (number) {
      case 37: str = "Left" ; break;
      case 38: str = "Up"   ; break;
      case 39: str = "Right"; break;
      case 40: str = "Down" ; break;

      /* A-Z */
      default: str = String.fromCharCode(number);
    }

    if (str === " ") {
      return "Spacebar";
    }

    if (str.length == 1) {
      return str.toUpperCase();
    }

    return str[0].toUpperCase() + str.slice(1);
  }

  update(): void {
    for (const key of KeyInfo.Keys) {
      this.justDown[key] = false;
    }

    for (const queuedEvent of this._queuedEvents) {
      const key = this.eventToKey(queuedEvent.event);

      if (queuedEvent.isDown) {
        if (!this.down[key]) {
          this.justDown[key] = true;
        }

        this.down[key]     = true;
      } else {
        this.down[key]     = false;
      }
    }

    this._queuedEvents = [];
  }
}