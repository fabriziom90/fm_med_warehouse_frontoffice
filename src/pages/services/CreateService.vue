<script setup>
import FormAddService from "../../components/FormAddService.vue";
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Aggiungi nuova prestazioni</h2>
          <router-link class="btn-main" to="/admin/services"
            >Visualizza prestazioni</router-link
          >
        </div>
      </div>
      <div class="col-12">
        <FormAddService :refresh="true" />
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
