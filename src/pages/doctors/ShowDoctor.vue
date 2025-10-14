<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { useRoute } from "vue-router";
import TableAppointments from "../../components/TableAppointments.vue";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const route = useRoute();

const doctorId = route.params.id;
const doctor = ref({});

onMounted(() => {
  api
    .get(`${configStore.apiBaseUrl}/doctors/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      doctor.value = resp.data.doctor;
    });
});
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row gy-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Dettaglio dottore</h2>
          <div>
            <router-link to="/admin/doctors" class="btn-main me-2"
              >Visualizza dottori</router-link
            >
            <router-link
              class="btn-main"
              to="/admin/medical_appointments/create"
            >
              Crea appuntamento
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div><strong>Nome:</strong></div>
        <div>{{ doctor.name }}</div>
      </div>
      <div class="col-12 col-md-4">
        <div><strong>Cognome:</strong></div>
        <div>{{ doctor.surname }}</div>
      </div>
      <div class="col-12 col-md-4">
        <div><strong>Specializzazione:</strong></div>
        <div>{{ doctor.specialty }}</div>
      </div>
    </div>
    <hr />
    <div class="row">
      <TableAppointments
        :doctor="doctor"
        v-if="Object.keys(doctor).length > 0"
      />
    </div>
  </div>
  <Modal v-if="isModalOpen" />
</template>
<style lang=""></style>
