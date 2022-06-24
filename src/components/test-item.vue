<script setup>
import * as tf from "@tensorflow/tfjs";
</script>
<template>
  <div>
    <h2>Test Bed</h2>
    <canvas ref="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script>
console.log(tf);
window.tf = tf;

export default {
  data() {
    return {
      value: 0,
      alive: 1,
      pause: 0,
    };
  },
  mounted() {
    /**@type {HTMLCanvasElement} */
    let canvas = this.$refs["canvas"];
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.canvas = canvas;
    this.ctx = ctx;
    this.update();
    canvas.addEventListener("mousedown", this.mousedown);
    canvas.addEventListener("mousemove", this.mousemove);
    canvas.addEventListener("mouseup", this.mouseup);
  },
  unmounted() {
    this.alive = 0;
    this.canvas.removeEventListener("mousedown", this.mousedown);
    this.canvas.removeEventListener("mouseup", this.mouseup);
  },
  methods: {
    mousedown(e) {
      let rect = e.target.getBoundingClientRect();
      let x = e.x - rect.x;
      let y = e.y - rect.y;
      this.pause = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    },
    mousemove(e) {
      let rect = e.target.getBoundingClientRect();
      let x = e.x - rect.x;
      let y = e.y - rect.y;
      if (this.pause) {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "white";
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }
    },
    mouseup(e) {
      let rect = e.target.getBoundingClientRect();
      let x = e.x - rect.x;
      let y = e.y - rect.y;
      this.ctx.strokeStyle = "white";

      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.pause = 0;
    },
    update() {
      if (this.alive) requestAnimationFrame(this.update);
      if (this.pause) return;
      tf.engine().startScope();
      let pixels = tf.browser.fromPixels(this.canvas);
      pixels = pixels.gather(0, 2);
      pixels = pixels.greater(128);
      pixels = tf.expandDims(pixels, 2);
      let sum33 = tf.conv2d(
        pixels.cast("float32"),
        tf.ones([3, 3, 1, 1]),
        1,
        "same"
      );

      pixels = pixels
        .logicalAnd(sum33.lessEqual(3))
        .logicalAnd(sum33.greaterEqual(2))
        .logicalOr(pixels.logicalNot().logicalAnd(sum33.equal(3)));
      tf.browser.toPixels(pixels.cast("float32"), this.canvas);
      tf.engine().endScope();
    },
  },
};
</script>
