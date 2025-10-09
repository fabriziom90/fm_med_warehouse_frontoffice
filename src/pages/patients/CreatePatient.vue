<script setup>
import FormAddPatient from "../../components/FormAddPatient.vue";
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Aggiungi nuovo paziente</h2>
          <router-link class="btn-main" to="/admin/patients"
            >Visualizza pazienti</router-link
          >
        </div>
      </div>
      <div class="col-12">
        <FormAddPatient :refresh="true" />
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
