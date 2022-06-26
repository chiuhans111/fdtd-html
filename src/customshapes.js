import { fabric } from "fabric";

const Grating = fabric.util.createClass(fabric.Object, {
  type: "grating",

  period: 20,
  fillfactor: 0.5,

  initialize: function (options) {
    this.callSuper("initialize", options);
  },

  _render: function (ctx) {
    if (this.period == 0) return;
    ctx.beginPath();

    const period = this.period / this.scaleX;
    const num = Math.min(this.width / period / 2, 100);

    for (let i = -num; i < num; i++) {
      ctx.rect(
        0 + period * i,
        -this.height / 2,
        this.fillfactor * period,
        this.height
      );
    }

    this._renderPaintInOrder(ctx);
  },
});

export { Grating };
