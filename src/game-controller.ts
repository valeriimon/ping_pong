import { GameControllerEntity } from "./interfaces";

interface GameControllerSettings {
  ctx: CanvasRenderingContext2D,
  posX: number,
  width: number,
  height: number,
  upKey: number,
  downKey: number,
  collisionFn: (ballX: number, ballY: number) => boolean
}

export class GameController {
  posY: number = 0;
  posX: number = 0;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  collisionFn: (ballX: number, ballY: number) => boolean
  constructor(public settings: GameControllerSettings) {
    this.render();
    this.width = settings.width;
    this.height = settings.height;
    this.ctx = settings.ctx;
    this.posX = settings.posX;
    this.collisionFn = settings.collisionFn.bind(this);
  }

  get topBorder() {
    return this.posY
  }

  get bottomBorder() {
    return this.posY + this.height;
  }

  get sideBorder() {
    return this.posX === 0 ? this.width : this.posX
  }

  render() {
    this.settings.ctx.fillStyle = "#fff";
    this.settings.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  update(options: Partial<GameControllerEntity>) {
    typeof options.posY === 'number' && (this.posY = options.posY);
    typeof options.width === 'number' && (this.width = options.width);
    typeof options.height === 'number' && (this.height = options.height);
  }

  move(keyCode: number) {
    let posY: number;
    if(keyCode === this.settings.upKey) {
      posY = this.posY - 15;
    }
    if(keyCode === this.settings.downKey) {
      posY = this.posY + 15;
    }

    if(this.bottomBorder <= this.ctx.canvas.height && this.topBorder >= 0 ) {
      this.update({posY});
    }
  }
}