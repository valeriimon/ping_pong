import { GameControllerEntity, GameControllerSettings } from "./interfaces";



export class GameController {
  posY: number = 0;
  posX: number = 0;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  collisionFn: (ballX: number, ballY: number, ballRadius: number) => boolean
  constructor(public settings: GameControllerSettings) {
    this.width = settings.width;
    this.height = settings.height;
    this.ctx = settings.ctx;
    this.posX = settings.posX;
    this.posY = settings.gameTopBorder;
    this.collisionFn = settings.collisionFn.bind(this);
    this.render();
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

    const updatedTopBorder = posY;
    const updatedBottomBorder = posY + this.height;
    const canUpdate = updatedBottomBorder <= this.settings.gameBottomBorder && updatedTopBorder >= this.settings.gameTopBorder;
    
    if(canUpdate) {
      this.update({posY});
    }
  }

  reset() {
    this.posY = this.settings.gameTopBorder;
    this.render();
  }

  render() {
    this.settings.ctx.fillStyle = this.settings.bgColor;
    this.settings.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}