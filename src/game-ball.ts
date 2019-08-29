export class GameBall {
  ctx: CanvasRenderingContext2D;
  radius: number = 10;
  x: number;
  xDir: '-' | '+' = Math.random() > 0.5 ? '+' : '-';
  y: number;
  yDir: '-' | '+' = Math.random() < 0.5 ? '+' : '-';

  constructor(public settings: any) {
    this.ctx = settings.ctx;
    this.x = this.ctx.canvas.width / 2;
    this.y = this.ctx.canvas.height / 2;
  }
  
  moveBall(collision: any) {
    if(collision.collisionByX) {
      this.xDir === '-' ? this.xDir = '+' : this.xDir = '-'
    }

    if(collision.collisionByY) {
      this.yDir === '-' ? this.yDir = '+' : this.yDir = '-'
    }

    this.x = this.xDir === '-' ? this.x - (2 * this.settings.speedFactor) : this.x + (2 * this.settings.speedFactor);
    this.y = this.yDir === '-' ? this.y - (2 * this.settings.speedFactor): this.y + (2 * this.settings.speedFactor);
  }

  reset() {
    this.x = this.ctx.canvas.width / 2;
    this.y = this.ctx.canvas.height / 2;
  }

  render(collision: any) {
    this.moveBall(collision);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'blue';
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}