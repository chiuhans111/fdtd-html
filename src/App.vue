<script setup>
import FdtdSim from "./components/fdtd-sim.vue";
</script>

<template>
  <div>
    <h1>FDTD simulator</h1>
    <div class="main">
      <FdtdSim></FdtdSim>
    </div>
  </div>
</template>

<style>
html,
body {
  text-align: center;
  margin: 0px;
  width: 100%;
  height: 100%;
  background: black;
  color: white;
}
.main {
  margin: auto;
  width: fit-content;
}
</style>
