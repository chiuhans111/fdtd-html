<script setup>
import FdtdSim from "./components/fdtd-sim.vue";
</script>

<template>
  <div class="main-container">
    <h1>FDTD simulator</h1>
    <div class="main">
      <FdtdSim></FdtdSim>
    </div>
    <div>
      <p>Project repo:</p>
      <a href="https://github.com/chiuhans111/fdtd-html"
        >https://github.com/chiuhans111/fdtd-html</a
      >
    </div>
  </div>
</template>

<style>
.main {
  margin: auto;
  width: fit-content;
}

.main-container {
  max-width: 1000px;
  margin: auto;
}
</style>
