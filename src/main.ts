import { GameController } from './game-controller';
import { ElementSize, GameControllerSettingsExtended, ControllerSettings, GameControllerSettings } from './interfaces';
import { GameBall } from './game-ball';
import { GameScoreboard } from './game-scoreboard';

type GameStatus = 'started' | 'paused' | 'finished';

interface GameSettings extends ElementSize {
  gameSpeedFactor: 1 | 2 | 3 | 4 | 5,
  winScore: number,
  gameBgColor: string,
  controller_1: ControllerSettings,
  controller_2: ControllerSettings
}

class PingPongGame {
  ctx: CanvasRenderingContext2D;
  controllers: GameController[] = [];
  ball: GameBall = null;
  scoreboard: GameScoreboard = null;
  animationFrameNum: number;
  
  gameStatus: GameStatus;
  leftPlayerIdx: number = 0;
  rightPlayerIdx: number = 1;

  get gameSizes() {
    return {
      width: this.ctx.canvas.width,
      topBorder: (this.scoreboard && this.scoreboard.height) || 0,
      bottomBorder: this.ctx.canvas.height
    }
  }

  constructor(selector: string, public settings: GameSettings) {
    const elem = document.querySelector(selector) as HTMLCanvasElement;
    if(elem && elem.getContext) {
      elem.width = settings.width;
      elem.height = settings.height;
      this.ctx = elem.getContext('2d');
    }

    
    this.scoreboard = new GameScoreboard({
      ctx: this.ctx,
      height: 100,
      width: this.gameSizes.width
    });
    this.registerEvents();
    this.registerControllers();

    
    
    this.ball = new GameBall({
      ctx: this.ctx,
      speedFactor: settings.gameSpeedFactor
    });
    
    this.renderMessage('Press "space" to start the game');
    this.scoreboard.render();
  }

  registerEvents() {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
      if(ev.keyCode === 32) {
        if (this.gameStatus === 'started') {
          return
        }
        else {
          this.gameStatus = 'started';
          this.animationFrameNum = requestAnimationFrame(this.render);
        }
      }
      this.controllers.forEach(it => it.move(ev.keyCode));
    })
  }

  registerControllers() {
    const gameCtrl_1: GameControllerSettings = {
      ...this.settings.controller_1,
      ctx: this.ctx,
      posX: 0,
      gameTopBorder: this.gameSizes.topBorder,
      gameBottomBorder: this.gameSizes.bottomBorder,
      collisionFn: function (ballX: number, ballY: number, ballRadius: number) {
        return ballX - ballRadius < this.sideBorder && (ballY > this.topBorder && ballY < this.bottomBorder);
      }
    }

    const gameCtrl_2: GameControllerSettings = {
      ...this.settings.controller_2,
      ctx: this.ctx,
      posX: this.gameSizes.width - this.settings.controller_2.width,
      gameTopBorder: this.gameSizes.topBorder,
      gameBottomBorder: this.gameSizes.bottomBorder,
      collisionFn: function (ballX: number, ballY: number, ballRadius: number) {
        return ballX + ballRadius > this.sideBorder && (ballY > this.topBorder && ballY < this.bottomBorder);
      }
    }

    this.controllers.push(
      new GameController(gameCtrl_1),
      new GameController(gameCtrl_2)
    )
  }

  

  scoreGoal(playerIdx: number) {
    const playerScore = this.scoreboard.scoreGoal(playerIdx);
    if(playerScore >= this.settings.winScore) {
      this.gameStatus = 'finished';
      this.resetGame(
        `Player ${playerIdx + 1} has won the game!!! Press 'space' to start new game`,
        'finished',
        this.ball, 
        this.scoreboard, 
        ...this.controllers
      )

      return
    }

    this.resetGame(
      `Player ${playerIdx + 1} has scored the goal!!! Press 'space' to continue.`,
      'paused',
      this.ball
    );
  }


  resetGame(msg: string, gameStatus: GameStatus, ...resetItems: any[]) {
    this.gameStatus = gameStatus;
    cancelAnimationFrame(this.animationFrameNum);
    resetItems.forEach(item => {
      item.reset();
    });

    this.renderMessage(msg);
  }

  detectCollision() {
    const ballX = this.ball.x;
    const ballY = this.ball.y;
    const ballRadius = this.ball.radius;
    let controllerCollision = false;
    for(let controller of this.controllers) {
      controllerCollision = controller.collisionFn(ballX, ballY, ballRadius);
      if(controllerCollision) break;
    }

    if(ballX + ballRadius > this.gameSizes.width) {
      this.scoreGoal(this.leftPlayerIdx);
    }

    if(ballX - ballRadius < 0) {
      this.scoreGoal(this.rightPlayerIdx);
    }

    const collisionByX = controllerCollision;
    const collisionByY = ballY + ballRadius >= this.gameSizes.bottomBorder || ballY - ballRadius <= this.gameSizes.topBorder;

    return {
      collisionByX,
      collisionByY
    }
  }

  renderMessage(msg: string) {
    this.ctx.fillStyle = this.settings.gameBgColor;
    this.ctx.fillRect(0, this.gameSizes.topBorder, this.gameSizes.width, this.gameSizes.bottomBorder);
    this.ctx.font = '16px Aria';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(msg, this.gameSizes.width / 2, this.gameSizes.bottomBorder / 2);
  }

  render = () => {
    this.ctx.fillStyle = this.settings.gameBgColor;
    this.ctx.fillRect(0, this.gameSizes.topBorder, this.gameSizes.width, this.gameSizes.bottomBorder);
    
    const collision = this.detectCollision();
    if(this.gameStatus === 'paused' || this.gameStatus === 'finished') return
    this.controllers.forEach(cntr => cntr.render())
    this.ball.render(collision);
    
    this.animationFrameNum = requestAnimationFrame(this.render);
  }
}

new PingPongGame('#canvas', {
  width: 1000,
  height: 500,
  gameSpeedFactor: 2,
  winScore: 11,
  gameBgColor: '#000',
  controller_1: {
    bgColor: '#fff',
    width: 20,
    height: 60,
    upKey: 38,
    downKey: 40
  },
  controller_2: {
    bgColor: '#fff',
    width: 20,
    height: 60,
    upKey: 87,
    downKey: 83
  }
});