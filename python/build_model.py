import tensorflow as tf
import subprocess
from tensorflow.keras import Input, Model
import tensorflowjs as tfjs
x = Input([None])
y = tf.slice(x, [0, 1], [-1, -1])

model = Model(x, y)
model.summary()
model.compile()
tfjs.converters.save_keras_model(model, './src/assets')


# model.save('./model.h5')
# subprocess.run([
#     "tensorflowjs_converter",
#     "--input_format keras",
#     "./model.h5",
#     "./model"
# ])
