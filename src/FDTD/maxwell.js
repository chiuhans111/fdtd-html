import * as tf from "@tensorflow/tfjs";

function maxwell(fields, dx, dt) {
  const X = 0;
  const Y = 1;
  const Z = 2;

  let temp = tf.tidy(() => {
    const dEdx = fields.E.slice([0, 1, 0])
      .pad([
        [0, 0],
        [0, 1],
        [0, 0],
      ])
      .sub(fields.E);

    const dEdy = fields.E.slice([1, 0, 0])
      .pad([
        [0, 1],
        [0, 0],
        [0, 0],
      ])
      .sub(fields.E);

    const curlE = tf.concat(
      [
        dEdy.gather(Z, 2).expandDims(2),
        dEdx.gather(Z, 2).expandDims(2).mul(-1),
        dEdx.gather(Y, 2).sub(dEdy.gather(X, 2)).expandDims(2),
      ],
      2
    );

    return tf.clipByValue(
      fields.H.sub(curlE.div(dx).div(fields.u).mul(dt).mul(fields.dilation))
        .mul(fields.attenuation)
        .mul(0.999),
      -1e10,
      1e10
    );
  });

  tf.dispose(fields.H);
  fields.H = temp;

  temp = tf.tidy(() => {
    const dHdx = fields.H.sub(
      fields.H.slice([0, 0, 0], [-1, fields.H.shape[1] - 1, -1]).pad([
        [0, 0],
        [1, 0],
        [0, 0],
      ])
    );

    const dHdy = fields.H.sub(
      fields.H.slice([0, 0, 0], [fields.H.shape[0] - 1, -1, -1]).pad([
        [1, 0],
        [0, 0],
        [0, 0],
      ])
    );

    const curlH = tf.concat(
      [
        dHdy.gather(Z, 2).expandDims(2),
        dHdx.gather(Z, 2).expandDims(2).mul(-1),
        dHdx.gather(Y, 2).sub(dHdy.gather(X, 2)).expandDims(2),
      ],
      2
    );

    return fields.E.add(
      curlH.div(dx).div(fields.e).mul(dt).mul(fields.dilation)
    ).mul(fields.attenuation);
  });
  tf.dispose(fields.E);
  fields.E = temp;
}

export default maxwell;
