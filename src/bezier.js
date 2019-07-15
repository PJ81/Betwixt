import * as Const from "./const.js";

class Point {
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor() {
    this.point = new Point();
    this.color = "white";
  }
}

export default class Bezier {
  constructor() {
    this.lines = [];
    this.points = [];
    this.wait = .05;
    this.len = 1;
    this.head = 0;

    for (let z = 0; z < Const.ITERATIONS; z++) {
      const l = new Line();
      l.color = `rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, 1)`;
      this.lines.push(l);
    }
    for (let z = 0; z < 4; z++) {
      this.points.push(new Point(Math.random() * Const.WIDTH, Math.random() * Const.HEIGHT));
    }
  }

  update(dt) {
    if ((this.wait -= dt) > 0) return;
    this.wait = .1;

    let t, t1, t2, t3, t4,
      z = this.head + 1,
      v = this.head - 1,
      x1 = this.points[0].x,
      x2 = this.points[1].x,
      x3 = this.points[2].x,
      x4 = this.points[3].x,
      y1 = this.points[0].y,
      y2 = this.points[1].y,
      y3 = this.points[2].y,
      y4 = this.points[3].y;

    if (v < 0) v = 0;

    t = z / Const.ITERATIONS;
    t1 = 1 - t;

    t2 = t1 * t1;
    t3 = t1 * t1 * t1;
    t4 = 3 * t;

    this.lines[this.head].point.x = (t3 * x1 + t4 * t2 * x2 + t4 * t * t1 * x3 + t * t * t * x4);
    this.lines[this.head].point.y = (t3 * y1 + t4 * t2 * y2 + t4 * t * t1 * y3 + t * t * t * y4);
    this.lines[this.head].color = this.lines[v].color;

    if (++this.head === Const.ITERATIONS) {
      this.head = 0;
      this.lines[this.head].color = `rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, 1)`;
      this.points[0].x = this.points[3].x;
      this.points[0].y = this.points[3].y;
      for (let z = 1; z < 4; z++) {
        this.points[z].set(Math.random() * Const.WIDTH, Math.random() * Const.HEIGHT);
      }

    }
    if (++this.len > Const.ITERATIONS) this.len = Const.ITERATIONS;
  }

  draw(ctx) {
    let z = 0;
    for (let l of this.lines) {
      ctx.fillStyle = l.color;
      if (l.point.x && l.point.y) {
        ctx.globalAlpha = .06;
        ctx.fillRect(l.point.x - 3, l.point.y - 3, 6, 6);
        ctx.globalAlpha = .15;
        ctx.fillRect(l.point.x - 1, l.point.y - 1, 2, 2);
      }
    }
    ctx.globalAlpha = 1;
  }
}