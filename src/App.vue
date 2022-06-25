<script setup>
import FdtdSim from "./components/fdtd-sim.vue";
</script>

<template>
  <div class="main-container">
    <h1>FDTD simulator</h1>
    <div class="main">
      <FdtdSim></FdtdSim>
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
