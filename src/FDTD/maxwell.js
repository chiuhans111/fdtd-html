import * as tf from "@tensorflow/tfjs";

function maxwell(fields, dx, dt, t, w) {
  // Constant for axis index
  const X = 0;
  const Y = 1;
  const Z = 2;

  // Compute del x E = - u dH/dt
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
        .mul(fields.absorption)
        .mul(0.9999),
      -1e10,
      1e10
    );
  });

  tf.dispose(fields.H);
  fields.H = temp;

  // Compute del x E = - u dH/dt
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
      fields.emission
        .mul(tf.cos(t * w))
        .mul(w / 10)
        .mul(dt)
        .pad([
          [0, 0],
          [0, 0],
          [2, 0],
        ])
    )
      .add(curlH.div(dx).div(fields.e).mul(dt).mul(fields.dilation))
      .mul(fields.absorption)
      .mul(fields.attenuation);
  });

  tf.dispose(fields.E);
  fields.E = temp;
}

export default maxwell;
