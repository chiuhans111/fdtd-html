import * as tf from "@tensorflow/tfjs";
import maxwell from "./maxwell";

function FDTD(
  pixel_W = 600,
  pixel_H = 400,
  border_size = 40,
  dx = 1,
  dt = 0.3
) {
  this.t = 0;
  this.w = 0.3;
  this.pixel_W = pixel_W;
  this.pixel_H = pixel_H;
  this.sim_W = pixel_W + border_size * 2;
  this.sim_H = pixel_H + border_size * 2;

  this.dx = dx;
  this.dt = dt;

  const W = this.sim_W * dx;
  const H = this.sim_H * dx;

  const x = tf.range(0, this.sim_W).mul(dx).cast("float32");
  const y = tf.range(0, this.sim_H).mul(dx).cast("float32");

  const grid = tf.meshgrid(x, y);
  console.log(grid[0]);

  const border = tf
    .minimum(
      tf.minimum(grid[0], grid[1]),
      tf.minimum(tf.sub(W, grid[0]), tf.sub(H, grid[1]))
    )
    .div(border_size)
    .clipByValue(0, 1);

  const dilation = border.sub(1).abs().mul(-0.05).exp().expandDims(2);
  const attenuation = border.sub(1).abs().mul(-0.1).exp().expandDims(2);

  this.fields = {
    E: tf.zeros([this.sim_H, this.sim_W, 3]),
    H: tf.zeros([this.sim_H, this.sim_W, 3]),
    e: tf.ones([this.sim_H, this.sim_W, 1]),
    u: tf.ones([this.sim_H, this.sim_W, 1]),
    gx: grid[0],
    gy: grid[1],
    // border,
    dilation,
    attenuation,
    absorption: tf.zeros([this.sim_H, this.sim_W, 1]),
    emission: tf.zeros([this.sim_H, this.sim_W, 1]),
  };

  this.clear = function () {
    this.fields.E.dispose();
    this.fields.E = tf.zeros([this.sim_H, this.sim_W, 3]);
    this.fields.H.dispose();
    this.fields.H = tf.zeros([this.sim_H, this.sim_W, 3]);
  };

  this.update = function () {
    for (let i = 0; i < 10; i++) {
      this.t += this.dt;
      maxwell(this.fields, this.dx, this.dt, this.t, this.w);
    }

    for (let i in this.fields) {
      this.fields[i] = tf.keep(this.fields[i]);
    }
  };
}

export default FDTD;
