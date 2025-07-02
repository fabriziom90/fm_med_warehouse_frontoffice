<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>
<template lang="">
  <div class="d-flex">
    <Sidebar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<style lang="scss" scoped>
main {
  height: 100vh;
  width: calc(100% - 200px);
  overflow-y: auto;
}
</style>
