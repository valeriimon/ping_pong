import { GameController } from './game-controller';
import { ElementSize } from './interfaces';
import { GameBall } from './game-ball';

class PingPongGame {
  ctx: CanvasRenderingContext2D;
  controllers: GameController[] = [];
  ball: GameBall = null;
  constructor(selector: string) {
    const elem = document.querySelector(selector) as HTMLCanvasElement;
    if(elem && elem.getContext) {
      this.ctx = elem.getContext('2d');
      this.ctx.canvas.width
    }

    this.registerEvents();

    this.controllers = [
      new GameController({
        ctx: this.ctx, height: 60, width: 20, posX: 0, upKey: 38, downKey: 40,
        collisionFn: function (ballX: number, ballY: number) {
          return ballX < this.sideBorder && ballY > this.topBorder && ballY < this.bottomBorder;
        }
      }),
      new GameController({
        ctx: this.ctx, height: 60, width: 20, posX: this.sizes.width - 20, upKey: 87, downKey: 83,
        collisionFn: function (ballX: number, ballY: number) {
          return ballX > this.sideBorder && ballY > this.topBorder && ballY < this.bottomBorder;
        } 
      })
    ];

    this.ball = new GameBall(this.ctx);
    requestAnimationFrame(this.render)
  }

  registerEvents() {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
      this.controllers.forEach(it => it.move(ev.keyCode));
    })
  }

  get sizes(): ElementSize {
    return {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    }
  }

  detectCollision() {
    const ballX = this.ball.x + 5;
    const ballY = this.ball.y - 5;
    let controllerCollision = false;
    for(let controller of this.controllers) {
      controllerCollision = controller.collisionFn(ballX, ballY);
      if(controllerCollision) break;
    }

    const collisionByX = controllerCollision || ballX > this.sizes.width || ballX < 0
    const collisionByY = ballY > this.sizes.height || ballY < 0;

    return {
      collisionByX,
      collisionByY
    }
  }

  render = () => {
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.sizes.width, this.sizes.height);
    const collision = this.detectCollision();
    this.controllers.forEach(cntr => cntr.render())
    this.ball.render(collision);
    
    requestAnimationFrame(this.render);
  }
}

new PingPongGame('#canvas');