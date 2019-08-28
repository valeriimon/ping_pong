export class GameBall {
  constructor(public ctx: CanvasRenderingContext2D) {
    this.x = this.ctx.canvas.width / 2;
    this.y = this.ctx.canvas.height / 2;
  }
  x: number;
  xDir: '-' | '+' = '+';
  y: number;
  yDir: '-' | '+' = '-';

  moveBall(collision: any) {
    if(collision.collisionByX) {
      this.xDir === '-' ? this.xDir = '+' : this.xDir = '-'
    }

    if(collision.collisionByY) {
      this.yDir === '-' ? this.yDir = '+' : this.yDir = '-'
    }

    this.x = this.xDir === '-' ? this.x - 2 : this.x + 2;
    this.y = this.yDir === '-' ? this.y - 2: this.y + 2;
  }

  render(collision: any) {
    this.moveBall(collision);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'blue';
    this.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}