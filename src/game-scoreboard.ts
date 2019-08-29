import { ElementSize } from "./interfaces";

interface ScoreboardSettings extends ElementSize {
  ctx: CanvasRenderingContext2D
}

export class GameScoreboard {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  score: number[] = [10, 0];
  dividerHeight: number = 5;

  constructor(settings: ScoreboardSettings) {
    this.width = settings.width;
    this.height = settings.height;
    this.ctx = settings.ctx;
  }

  scoreGoal(idx: number) {
    this.score[idx]++;
    this.render();

    return this.score[idx];
  }

  reset() {
    this.score = [0, 0];
    this.render();
  }

  renderPlayersData() {
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '24px Aria';
    this.ctx.fillText(`Player 1`, 100, this.height / 2);
    this.ctx.fillText(`Player 2`, this.width - 100, this.height / 2);

    this.ctx.fillRect(this.width / 2, 10, 5, this.height - this.dividerHeight - 20);
    
    this.ctx.font = '50px Aria';
    this.ctx.fillText(`${this.score[0]}`, (this.width / 2) - 100, this.height / 2);
    this.ctx.fillText(`${this.score[1]}`, (this.width / 2) + 100, this.height / 2);
  }
  
  render() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height - this.dividerHeight);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, this.height - this.dividerHeight, this.width, this.dividerHeight);

    this.renderPlayersData();
  }
}