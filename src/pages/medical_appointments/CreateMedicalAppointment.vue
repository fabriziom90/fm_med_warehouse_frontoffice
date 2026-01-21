<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../../router/index.js";
import FormAddDoctor from "../../components/FormAddDoctor.vue";
import FormAddService from "../../components/FormAddService.vue";

const configStore = useConfigStore();
const $toast = useToast();
const token = localStorage.getItem("token");

const doctors = ref([]);
const services = ref([]);
const userEditedAssigned = ref(false);
const form = ref({
  doctor: "",
  service: "",
  date: "",
  service: "",
  total: "",
  serviceValue: "",
  percentageToDoctor: "",
  assignedAmount: "",
});

onMounted(() => {
  getDoctors();
  getServices();
});

watch(
  () => [form.value.serviceValue, form.value.percentageToDoctor],
  ([newServiceValue, newPercentage]) => {
    if (!userEditedAssigned.value) {
      const serviceValue = parseFloat(newServiceValue) || 0;
      const percentage = parseFloat(newPercentage) || 0;
      form.value.assignedAmount = ((serviceValue * percentage) / 100).toFixed(
        2
      );
    }
  }
);

const handleSubmit = () => {
  try {
    api
      .post(`${configStore.apiBaseUrl}/medical_appointments`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
          setTimeout(() => {
            router.push(
              {
                name: "showDoctor",
                params: { id: form.value.doctor },
              },
              1500
            );
          });
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  } catch (err) {
    $toast.error(err.data.message, {
      position: "top-right",
      duration: 3000,
    });
  }
};

const setDoctor = (doc) => {
  getDoctors();
  form.value.doctor = doc._id;
};

const setService = (pat) => {
  getServices();
  form.value.service = pat._id;
};

const getDoctors = () => {
  api
    .get(`${configStore.apiBaseUrl}/doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      doctors.value = resp.data.doctors;
    });
};

const getServices = () => {
  api
    .get(`${configStore.apiBaseUrl}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      services.value = resp.data.services;
    });
};
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h2>Aggiungi appuntamento medico</h2>
      </div>
      <div class="col-12">
        <form @submit.prevent="handleSubmit" class="mt-4">
          <div class="row mt-4">
            <div class="col-4">
              <label for="" class="form-label">Dottore</label>
              <select
                name="doctor"
                id="doctor"
                class="form-select"
                v-model="form.doctor"
              >
                <option value="">Seleziona dottore</option>
                <option
                  :value="doctor._id"
                  v-for="doctor in doctors"
                  :key="doctor._id"
                >
                  {{ doctor.name }} {{ doctor.surname }}
                </option>
                <option value="add-doctor">Aggiungi medico</option>
              </select>
            </div>
            <div class="col-4">
              <label for="" class="form-label">Prestazione</label>
              <select
                name="service"
                id="service"
                class="form-select"
                v-model="form.service"
              >
                <option value="">Seleziona prestazione</option>
                <option
                  :value="service._id"
                  v-for="service in services"
                  :key="service._id"
                >
                  {{ service.name }}
                </option>
                <option value="add-service">Aggiungi prestazione</option>
              </select>
            </div>
          </div>
          <div class="row mt-4" v-if="form.doctor === 'add-doctor'">
            <div class="col-12">
              <div class="card-form">
                <FormAddDoctor :refresh="false" @setDoctorSelect="setDoctor" />
              </div>
            </div>
          </div>
          <div class="row mt-4" v-if="form.service === 'add-service'">
            <div class="col-12">
              <div class="card-form">
                <FormAddService
                  :refresh="false"
                  @setServiceSelect="setService"
                />
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-4">
              <label for="" class="form-label">Data</label>
              <input
                type="date"
                name="date"
                id="date"
                class="form-control"
                placholder="Data della visita"
                v-model="form.date"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-3">
              <label for="" class="form-label">Totale in fattura</label>
              <input
                type="number"
                name="total"
                id="total"
                step="0.01"
                min="0"
                class="form-control"
                placeholder="Totale in fattura"
                v-model="form.total"
              />
            </div>
            <div class="col-3">
              <label for="" class="form-label">Valore prestazione</label>
              <input
                type="number"
                name="serviveValue"
                id="serviceValue"
                class="form-control"
                step="0.01"
                min="0"
                placeholder="Valore prestazione"
                v-model="form.serviceValue"
              />
            </div>
            <div class="col-3">
              <label for="" class="form-label">% al medico</label>
              <input
                type="number"
                name="percentageToDoctor"
                id="percentageToDoctor"
                class="form-control"
                min="0"
                placeholder="Percentuale al dottore"
                v-model="form.percentageToDoctor"
              />
            </div>
            <div class="col-3">
              <label for="" class="form-label">Somma assegnata</label>
              <input
                type="number"
                name="assignedAmount"
                id="assignedAmount"
                class="form-control"
                placeholder="Somma assegnata"
                step="0.01"
                min="0"
                v-model="form.assignedAmount"
                @input="userEditedAssigned = true"
              />
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <button type="submit" class="btn-main">Salva</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss" as *;
@use "../../styles/_partials/variables" as *;
.card-form {
  background-color: $mainColor;
  padding: 20px;
  border-radius: 20px;
  color: #fff;
}
</style>
