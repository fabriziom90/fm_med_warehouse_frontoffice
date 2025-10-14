<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { useRoute } from "vue-router";
import TableAppointments from "../../components/TableAppointments.vue";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const route = useRoute();

const patientId = route.params.id;
const patient = ref({});

onMounted(() => {
  api
    .get(`${configStore.apiBaseUrl}/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      patient.value = resp.data.patient;
    });
});
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row gy-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Dettaglio paziente</h2>
          <div>
            <router-link to="/admin/patients" class="btn-main"
              >Visualizza pazienti</router-link
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
        <div>{{ patient.name }}</div>
      </div>
      <div class="col-12 col-md-4">
        <div><strong>Cognome:</strong></div>
        <div>{{ patient.surname }}</div>
      </div>
    </div>
    <hr />
    <div class="row">
      <TableAppointments
        :people="patient"
        :type="2"
        v-if="Object.keys(patient).length > 0"
      />
    </div>
  </div>
</template>
<style lang=""></style>
