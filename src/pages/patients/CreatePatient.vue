<script setup>
import { ref } from "vue";
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../../router";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const $toast = useToast();

const form = ref({
  name: "",
  surname: "",
});

const handleSubmit = async () => {
  try {
    await api
      .post(`${configStore.apiBaseUrl}/patients`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
          setTimeout(() => {
            router.push({ name: "indexPatients" });
          }, 1500);
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};
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
            <button type="submit" class="btn-main">Salva</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
