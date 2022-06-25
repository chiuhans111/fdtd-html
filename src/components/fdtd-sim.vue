<template>
  <div>
    <div class="container">
      <div class="canvas-container">
        <canvas id="fabric" ref="canvas_fabric"> </canvas>
        <canvas id="wave" ref="canvas"> </canvas>
      </div>
      <div>
        <button @click="pause = true" v-if="!pause">pause</button>
        <button @click="pause = false" v-if="pause">continue</button>
        <button @click="clear">clear</button>
        <button @click="add('rect')">add rect</button>
        <button @click="add('circle')">add circle</button>
        <div class="menu">
          <div class="menu_obj" v-for="(obj, i) in selected_object" :key="i">
            {{ obj }}
            <div class="row">
              <label>x: </label>
              <input type="text" v-model.number="obj.left" size="6" />
              <label>y: </label>
              <input type="text" v-model.number="obj.top" size="6" />
            </div>

            <!-- <div class="row">
              <label>width: </label>
              <input type="text" v-model.number="obj.width" size="6" />
              <label>height: </label>
              <input type="text" v-model.number="obj.height" size="6" />
            </div> -->

            <div class="row">
              <label>scaleX: </label>
              <input type="text" v-model.number="obj.scaleX" size="6" />
              <label>scaleY: </label>
              <input type="text" v-model.number="obj.scaleY" size="6" />
            </div>

            <div class="row">
              <label>angle: </label>
              <input type="text" v-model.number="obj.angle" size="6" />
            </div>

            <div class="row">
              <label>index: </label>
              <input type="text" v-model.number="obj.index" size="6" />
            </div>
            <div class="row">
              <label>absorption: </label>
              <input type="text" v-model.number="obj.absorption" size="6" />
            </div>
            <div class="row">
              <label>emission: </label>
              <input type="text" v-model.number="obj.emission" size="6" />
            </div>

            <div class="row">
              <button @click="layerUp(obj)">UP</button>
              <button @click="layerDown(obj)">DOWN</button>
            </div>
            <button @click="del(obj)">DELETE</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.canvas-container {
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  #wave {
    background-color: black;
    border: solid 1px gray;
    pointer-events: none;
    mix-blend-mode: screen;
  }
}

.container {
  display: flex;
}

.menu {
  width: 300px;
  margin-left: 10px;

  &_obj {
    border: solid 1px gray;
    margin: 5px;
    padding: 4px;
  }
}
</style>
<script>
import * as tf from "@tensorflow/tfjs";
import FDTD from "../FDTD/fdtd";
import { fabric } from "fabric";
import { toRaw } from "vue";

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

function inject_optics_prop(obj, index = 1.33, absorption = 0, emission = 0) {
  obj.index = index;
  obj.absorption = absorption;
  obj.emission = emission;
  obj.cornerSize = 6;
}

const fdtd = new FDTD();
window.fields = fdtd.fields;
let canvas_fabric = null;
export default {
  data() {
    const data = {
      /**@type {HTMLCanvasElement} */
      canvas: null,
      /**@type {CanvasRenderingContext2D} */
      ctx: null,
      alive: true,
      t: 0,

      /**@type {HTMLCanvasElement} */
      canvas2: document.createElement("Canvas"),
      /**@type {CanvasRenderingContext2D} */
      ctx2: null,
      pause: false,

      selected_object: [],
    };

    return data;
  },
  mounted() {
    this.canvas = this.$refs["canvas"];
    this.ctx = this.canvas.getContext("2d");
    this.ctx2 = this.canvas2.getContext("2d");
    // Prepare Canvas
    this.canvas.width = fdtd.sim_W;
    this.canvas.height = fdtd.sim_H;

    // Prepare Secondary Canvas
    this.canvas2.width = fdtd.sim_W;
    this.canvas2.height = fdtd.sim_H;

    // Prepare Fabric Canvas
    canvas_fabric = new fabric.Canvas(this.$refs.canvas_fabric);
    console.log(canvas_fabric);

    canvas_fabric.setHeight(fdtd.sim_H);
    canvas_fabric.setWidth(fdtd.sim_W);

    window.canvas_fabric = canvas_fabric;

    // Canvas Drawing
    const canvas = this.canvas2;
    const ctx = this.ctx2;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    fdtd.fields.E = tf.browser.fromPixels(canvas).cast("float32").div(255);

    this.update();

    canvas_fabric.on("mouse:down", this.mousedown);
    canvas_fabric.on("object:modified", this.modified);
    canvas_fabric.on("selection:created", this.selected);
    canvas_fabric.on("selection:updated", this.selected);
  },
  unmounted() {
    this.alive = false;
  },
  methods: {
    layerUp(obj) {
      canvas_fabric.bringFoward(toRaw(obj), true);
    },
    layerDown(obj) {
      canvas_fabric.sendBackwards(toRaw(obj), true);
    },
    add(type) {
      if (type == "circle") {
        const obj = new fabric.Circle({
          fill: "red",
          width: 100,
          height: 100,
          radius: 100,
        });
        inject_optics_prop(obj);
        canvas_fabric.add(obj);
      } else if (type == "rect") {
        const obj = new fabric.Rect({
          fill: "red",
          width: 100,
          height: 100,
          radius: 100,
        });
        inject_optics_prop(obj);
        canvas_fabric.add(obj);
      }
    },
    del(obj) {
      console.log("delete", obj);
      canvas_fabric.remove(toRaw(obj));
      this.selected_object = this.selected_object.filter((x) => x !== obj);
      this.$forceUpdate();
    },
    clear() {
      fdtd.clear();
    },
    selected(e) {
      console.log(e);
      this.selected_object = e.selected;
      this.$forceUpdate();
    },
    modified(e) {
      console.log(e);
      this.$forceUpdate();
    },
    mousedown(e) {
      // console.log(e);
      if (e.target) return;
      const x = e.pointer.x;
      const y = e.pointer.y;

      const ctx = this.ctx2;
      const canvas = this.canvas2;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let temp = tf.tidy(() =>
        fdtd.fields.E.add(
          tf.browser.fromPixels(canvas).cast("float32").div(255)
        )
      );
      tf.dispose(fdtd.fields.E);
      fdtd.fields.E = temp;
    },
    update() {
      if (this.alive) setTimeout(this.update, 30);
      if (this.pause) return;

      // Set e
      let results = tf.tidy(() => {
        let objects = canvas_fabric.getObjects();

        let max_index = 1;
        let max_absorption = 0.1;
        let max_emission = 0.1;

        for (let obj of objects) {
          max_index = Math.max(obj.index, max_index);
          max_absorption = Math.max(obj.absorption, max_absorption);
          max_emission = Math.max(obj.emission, max_emission);
        }

        for (let obj of objects) {
          obj.original_fill = obj.fill;
          obj.fill = `rgb(${(obj.index / max_index) * 255}, ${
            (obj.emission / max_emission) * 255
          }, ${(obj.absorption / max_absorption) * 255})`;
          max_index = Math.max(obj.index, max_index);
        }

        canvas_fabric.renderAll();

        let canvas_pixels = tf.browser
          .fromPixels(canvas_fabric.toCanvasElement())
          .cast("float32")
          .div(255);

        let epsilon = canvas_pixels
          .gather(0, 2)
          .expandDims(2)
          .mul(max_index)
          .maximum(1)
          .pow(2);
        let absorber = canvas_pixels
          .gather(2, 2)
          .expandDims(2)
          .mul(max_absorption)
          .sub(1)
          .abs();
        let emitter = canvas_pixels
          .gather(1, 2)
          .expandDims(2)
          .mul(max_emission);

        // for (let obj of objects) {
        //   obj.fill = obj.original_fill;
        // }

        return [epsilon, absorber, emitter];
      });

      tf.dispose([fdtd.fields.e, fdtd.fields.absorption, fdtd.fields.emission]);
      fdtd.fields.e = results[0];
      fdtd.fields.absorption = results[1];
      fdtd.fields.emission = results[2];

      canvas_fabric.requestRenderAll();

      tf.engine().startScope();
      fdtd.update();

      // tf.browser.toPixels(
      //   fdtd.fields.e.gather(2, 2).clipByValue(0, 1),
      //   this.canvas
      // );
      tf.browser.toPixels(norm_draw(fdtd.fields.E.gather(2, 2)), this.canvas);

      tf.engine().endScope();
    },
  },
};
</script>
