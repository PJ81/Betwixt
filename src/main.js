import * as Const from "./const.js"
import Game from "./game.js"
import Bezier from "./bezier.js";

class Betwixt extends Game {
  constructor() {
    super();
    this.from;
    this.to;
    this.pos;
    this.score;
    this.span;
    this.state;
    this.lives;

    this.bezier = [];
    for (let z = 0; z < 16; z++) {
      this.bezier.push(new Bezier());
    }
    this.best = 0;

    this.bar = {
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0,
      wid: 0,
      border: 0,
      fill: 0
    }

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = "#dedede";

    this.canvas.addEventListener("click", () => this.click());
    this.canvas.addEventListener("touchstart", () => this.click());
    this.restart();
    this.loop(0);
  }

  click() {
    switch (this.state) {
      case Const.START:
        this.state = Const.WAIT;
        break;
      case Const.WAIT:
        this.checkResult();
        break;
      case Const.DONE:
      case Const.LOSE:
        this.create();
        this.state = Const.WAIT;
        break;
      case Const.GAMEOVER:
        this.restart();
        break;
    }
  }

  restart() {
    this.score = 0;
    this.span = 12;
    this.counter = 0;
    this.lives = 3;
    this.state = Const.START;
    this.create();
  }

  checkResult() {
    const z = Math.floor(this.pos);
    if (z >= this.from && z <= this.to) {
      this.state = Const.WIN;
    } else {
      if (--this.lives < 1) this.state = Const.GAMEOVER;
      else this.state = Const.LOSE;
    }
  }

  create() {
    this.from = Math.floor(Math.random() * (100 - this.span) + 1);
    this.to = this.from + this.span;
    this.pos = 0;

    this.bar.wid = Math.floor(Math.random() * (Const.WIDTH - 60)) + 40;
    this.bar.sX = (Const.WIDTH >> 1) - (this.bar.wid >> 1);
    this.bar.eX = this.bar.sX + this.bar.wid;
    this.bar.sY = 130;
    this.bar.eY = this.bar.sY + 16;

    const a = Math.random() * 155 + 100,
      b = Math.random() * 155 + 100,
      c = Math.random() * 155 + 100;
    this.bar.border = `rgba(${a},${b},${c},1)`;
    this.bar.fill = `rgba(${a},${b},${c},.5)`
  }

  update(dt) {
    for (let i of this.bezier) i.update(dt);

    switch (this.state) {
      case Const.START:
        break;
      case Const.WAIT:
        this.pos += dt * 10;
        if (this.pos > 100) {
          this.state = Const.LOSE;
        }
        break;
      case Const.WIN:
        break;
      case Const.LOSE:
        break;
    }
  }

  drawBar() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.bar.sX, this.bar.sY, this.bar.wid, 16);

    this.ctx.fillStyle = this.bar.fill;
    this.ctx.fillRect(this.bar.sX, this.bar.sY, this.bar.wid * this.pos / 100, 16);

    this.ctx.strokeSize = 8;
    this.ctx.strokeStyle = this.bar.border;
    this.ctx.beginPath();
    this.ctx.moveTo(this.bar.sX, this.bar.sY);
    this.ctx.lineTo(this.bar.eX, this.bar.sY);
    this.ctx.lineTo(this.bar.eX, this.bar.eY);
    this.ctx.lineTo(this.bar.sX, this.bar.eY);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.fillStyle = "#fff";
    if (this.state != Const.WAIT)
      this.ctx.fillText(`${Math.floor(this.pos)}`, this.bar.sX + this.bar.wid * this.pos / 100, this.bar.eY + 16);
  }

  draw() {
    const hw = (Const.WIDTH >> 1) - ((14 * this.lives) >> 1);
    this.ctx.fillStyle = "#f20";
    this.ctx.font = "14px 'Press Start 2P'";
    for (let z = 0; z < this.lives; z++)
      this.ctx.fillText("❤", hw + 15 * z + 7, 32);

    for (let i of this.bezier) i.draw(this.ctx);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "8px 'Press Start 2P'";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`score: ${this.score}`, 10, 16);
    this.ctx.textAlign = "right";
    this.ctx.fillText(`best: ${this.best}`, Const.WIDTH - 10, 16);
    switch (this.state) {
      case Const.START:
        this.ctx.font = "10px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("click to start", Const.WIDTH >> 1, Const.HEIGHT >> 1);
        break;
      case Const.WIN:
        this.score++;
        this.counter++;
        if (0 === this.counter % 2) {
          if (--this.span < 6) this.span = 6;
        }
        if (this.score > this.best) {
          this.best = this.score;
        }
        this.state = Const.DONE;
        break;
      case Const.DONE:
        this.ctx.font = "10px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("perfect!", Const.WIDTH >> 1, Const.HEIGHT * .6);
        this.ctx.font = "9px 'Press Start 2P'";
        this.ctx.fillText("click", Const.WIDTH >> 1, Const.HEIGHT * .7);
        this.ctx.fillText(`${this.from} to ${this.to}`, Const.WIDTH >> 1, Const.HEIGHT * .3);
        this.drawBar();
        break;
      case Const.LOSE:
        this.ctx.font = "10px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("you failed!", Const.WIDTH >> 1, Const.HEIGHT * .6);
        this.ctx.font = "9px 'Press Start 2P'";
        this.ctx.fillText("try again.", Const.WIDTH >> 1, Const.HEIGHT * .7);
        this.ctx.fillText(`${this.from} to ${this.to}`, Const.WIDTH >> 1, Const.HEIGHT * .3);
        this.drawBar();
        break;
      case Const.WAIT:
        this.ctx.textAlign = "center";
        this.ctx.font = "10px 'Press Start 2P'";
        this.ctx.fillText(`${this.from} to ${this.to}`, Const.WIDTH >> 1, Const.HEIGHT * .3);
        this.drawBar();
        break;
      case Const.GAMEOVER:
        this.ctx.font = "16px 'Press Start 2P'";
        this.ctx.textAlign = "center";
        this.ctx.fillText("game over!", Const.WIDTH >> 1, Const.HEIGHT * .6);
        this.ctx.font = "9px 'Press Start 2P'";
        this.ctx.fillText("click to play again.", Const.WIDTH >> 1, Const.HEIGHT * .7);
        this.ctx.fillText(`${this.from} to ${this.to}`, Const.WIDTH >> 1, Const.HEIGHT * .3);
        this.drawBar();
        break;
    }
  }
}

new Betwixt();