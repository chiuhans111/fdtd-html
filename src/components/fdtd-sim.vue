<script setup>
import * as tf from "@tensorflow/tfjs";
import maxwell from "../FDTD/maxwell";
import { fabric } from "fabric";
</script>
<template>
  <div>
    <div class="container">
      <canvas id="fabric" ref="canvas_fabric"> </canvas>
      <canvas id="wave" ref="canvas"> </canvas>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  #wave {
    pointer-events: none;
    mix-blend-mode: screen;
  }
}
</style>
<script>
let border_size = 30;
const pixel_W = 600;
const pixel_H = 400;
const sim_W = pixel_W + border_size * 2;
const sim_H = pixel_H + border_size * 2;

window.tf = tf;

const dx = 1;
const dt = 0.1;

const W = sim_W * dx;
const H = sim_H * dx;

let x = tf.range(0, sim_W).mul(dx).cast("float32");
let y = tf.range(0, sim_H).mul(dx).cast("float32");
let grid = tf.meshgrid(x, y);
console.log(grid[0]);

let border = tf
  .minimum(
    tf.minimum(grid[0], grid[1]),
    tf.minimum(tf.sub(W, grid[0]), tf.sub(H, grid[1]))
  )
  .div(border_size)
  .clipByValue(0, 1);

let dilation = border.sub(1).abs().mul(-0.05).exp().expandDims(2);
let attenuation = border.sub(1).abs().mul(-0.1).exp().expandDims(2);

console.log(border.shape);

let fields = {
  E: tf.zeros([sim_H, sim_W, 3]),
  H: tf.zeros([sim_H, sim_W, 3]),
  e: tf.ones([sim_H, sim_W, 1]),
  u: tf.ones([sim_H, sim_W, 1]),
  // gx: grid[0],
  // gy: grid[1],
  // border,
  dilation,
  attenuation,
};

function norm_draw(data) {
  return tf.tidy(() => {
    const max_val = 0.1; //tf.max(tf.abs(data));
    const normalize = data.div(max_val).expandDims(2);
    return tf
      .concat([normalize, normalize.abs(), normalize.mul(-1)], 2)
      .clipByValue(0, 1);
  });

  // return data.mul(20).clipByValue(0.5, 1.5).sub(0.5);
}

window.fields = fields;

export default {
  data() {
    return {
      /**@type {HTMLCanvasElement} */
      canvas: null,
      /**@type {CanvasRenderingContext2D} */
      ctx: null,
      alive: true,
      t: 0,

      /**@type {HTMLCanvasElement} */
      canvas2: null,
      /**@type {CanvasRenderingContext2D} */
      ctx2: null,
    };
  },
  mounted() {
    // Prepare Canvas
    this.canvas = this.$refs["canvas"];
    this.canvas.width = sim_W;
    this.canvas.height = sim_H;

    // Prepare Secondary Canvas
    this.canvas2 = document.createElement("Canvas");
    this.canvas2.width = sim_W;
    this.canvas2.height = sim_H;
    this.ctx2 = this.canvas2.getContext("2d");

    // Prepare Fabric Canvas

    this.canvas_fabric = new fabric.Canvas(this.$refs["canvas_fabric"]);
    this.canvas_fabric.setWidth(sim_W);
    this.canvas_fabric.setHeight(sim_H);

    for (let i = 0; i < 10; i++) {
      const rect = new fabric.Rect({
        fill: "red",
        width: 20,
        height: 20,
      });
      this.canvas_fabric.add(rect);
    }

    window.canvas_fabric = this.canvas_fabric;

    // Canvas Drawing
    const canvas = this.canvas2;
    const ctx = this.ctx2;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    fields.E = tf.browser.fromPixels(canvas).cast("float32").div(255);

    // const index = 2;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "white";
    // ctx.fillRect(100, 100, 50, 200);
    // let device = tf.browser
    //   .fromPixels(canvas)
    //   .cast("float32")
    //   .div(255)
    //   .gather(1, 2)
    //   .expandDims(2);
    // fields.e = fields.e.add(device.mul(index ** 2 - 1));

    // save();
    this.update();
    addEventListener("mousedown", this.mousedown);
  },
  unmounted() {
    this.alive = false;
  },
  methods: {
    mousedown(e) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.x - rect.x;
      const y = e.y - rect.y;

      const ctx = this.ctx2;
      const canvas = this.canvas2;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let temp = fields.E.add(
        tf.browser.fromPixels(canvas).cast("float32").div(255)
      );
      tf.dispose(fields.E);
      fields.E = temp;

      e.preventDefault();
    },
    update() {
      // if (this.t > 400) return;

      // this.canvas_fabric.interactive = false;
      // this.canvas_fabric.selection = false;
      let index = 2;

      tf.engine().startScope();

      tf.dispose(fields.e);

      fields.e = tf.tidy(() => {
        let device = tf.browser
          .fromPixels(this.canvas_fabric.toCanvasElement())
          .cast("float32")
          .div(255)
          .gather(0, 2)
          .expandDims(2);
        this.canvas_fabric.requestRenderAll();

        return tf.ones([sim_H, sim_W, 1]).add(device.mul(index ** 2 - 1));
      });
      if (this.alive) requestAnimationFrame(this.update);

      for (let i = 0; i < 10; i++) {
        this.t += dt;
        maxwell(fields, dx, dt);
      }

      for (let i in fields) {
        fields[i] = tf.keep(fields[i]);
      }

      tf.browser.toPixels(norm_draw(fields.E.gather(2, 2)), this.canvas);

      // tf.browser.toPixels(norm_draw(fields.border), this.canvas);
      // fields.E.pow(2).sum().print();
      tf.engine().endScope();
    },
  },
};
</script>
