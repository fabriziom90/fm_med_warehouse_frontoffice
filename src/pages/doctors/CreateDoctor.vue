<script setup>
import FormAddDoctor from "../../components/FormAddDoctor.vue";
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="fs-1">Aggiungi nuovo medicinale</h2>
          <router-link to="/admin/doctors" class="btn-main"
            >Visualizza dottori</router-link
          >
        </div>
      </div>
      <div class="col-12">
        <FormAddDoctor :refresh="true" />
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
