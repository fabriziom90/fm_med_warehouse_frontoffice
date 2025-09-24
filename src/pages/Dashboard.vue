<script setup>
import { ref, onMounted } from "vue";
import { useConfigStore } from "../stores/configStore";

import Tabs from "../components/Tabs.vue";

const configStore = useConfigStore();
</script>
<template lang="">
  <div class="container-fluid my-4">
    <div class="row">
      <div class="col-12">
        <h2>Dashboard</h2>
      </div>
      <div class="col-12">
        <Tabs />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/generals.scss";
@import "../styles/_partials/_variables.scss";
</style>
