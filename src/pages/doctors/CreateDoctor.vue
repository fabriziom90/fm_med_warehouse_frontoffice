<script setup>
import api from "../../services/api";
import { ref } from "vue";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../../router/index.js";

const configStore = useConfigStore();

const token = localStorage.getItem("token");

const $toast = useToast();

const form = ref({
  name: "",
  surname: "",
  specialty: "",
});

const handleSubmit = async (req, res) => {
  try {
    await api
      .post(`${configStore.apiBaseUrl}/doctors`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
          setTimeout(() => {
            router.push({ name: "indexDoctors" });
          }, 1500);
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } catch (err) {
    console.log(
      "Si è verificato un errore. Contattare l'amministratore del sistema: " +
        err
    );
  }
};
</script>
<template lang="">
  <div class="container-fluid">
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
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <div class="form-label">Nome</div>
            <input
              type="text"
              class="form-control"
              placeholder="Nome"
              name="name"
              id="name"
              v-model="form.name"
            />
          </div>
          <div class="mb-4">
            <div class="form-label">Cognome</div>
            <input
              type="text"
              class="form-control"
              placeholder="Cognome"
              name="surname"
              id="surname"
              v-model="form.surname"
            />
          </div>
          <div class="mb-4">
            <div class="form-label">Specializzazione</div>
            <input
              type="text"
              class="form-control"
              placeholder="Specializzazione"
              name="specialty"
              id="specialty"
              v-model="form.specialty"
            />
          </div>
          <div class="mb-4">
            <button class="btn-main" type="submit">Salva</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
