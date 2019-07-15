import * as Const from "./const.js";

export default class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.width = Const.WIDTH * Const.SCALE;
    this.canvas.height = Const.HEIGHT * Const.SCALE;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(Const.SCALE, Const.SCALE);
    document.body.appendChild(this.canvas);
    this.lastTime = 0;
    this.accumulator = 0;
    this.deltaTime = 1 / 120;
    this.loop = (time) => {
      this.accumulator += (time - this.lastTime) / 1000;
      while (this.accumulator > this.deltaTime) {
        this.accumulator -= this.deltaTime;
        this.update(Math.min(this.deltaTime, .5));
      }
      this.lastTime = time;
      this.ctx.clearRect(0, 0, Const.WIDTH, Const.HEIGHT);
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}