<script setup>
import FdtdSim from "./components/fdtd-sim.vue"
</script>

<template>
  <div class="main-container">
    <h1>FDTD simulator</h1>
    <div class="main">
      <FdtdSim></FdtdSim>
    </div>
    <div>
      <br>
      <hr>
      <p>Developer: <a
          href="https://chiuhans111.github.io">Hans Chiu</a>
      </p>
      <p>Repo: <a
          href="https://github.com/chiuhans111/fdtd-html">https://github.com/chiuhans111/fdtd-html</a>
      </p>
    </div>
  </div>
</template>

<style>
.main {
  margin: auto;
  width: 100%;
}

.main-container {
  width: 100%;
  max-width: 1020px;
  margin: auto;
}
</style>
