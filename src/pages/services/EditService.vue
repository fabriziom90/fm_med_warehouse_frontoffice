<script setup>
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";
import { router } from "../../router/index";
import { useRoute } from "vue-router";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const $toast = useToast();
const route = useRoute();

const serviceId = route.params.id;

const form = ref({
  name: "",
  surname: "",
});

onMounted(() => {
  api
    .get(`${configStore.apiBaseUrl}/services/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      const { name } = resp.data.service;
      form.value = {
        name
      };
    });
});

const handleSubmit = () => {
  try {
    api
      .put(`${configStore.apiBaseUrl}/services/${serviceId}`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
          setTimeout(() => {
            router.push({ name: "indexServices" });
          }, 1500);
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  } catch (err) {
    $toast.error(err.message, {
      position: "top-right",
      duration: 3000,
    });
  }
};
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Modifica prestazioni</h2>
          <router-link to="/admin/services" class="btn-main"
            >Visualizza prestazioni</router-link
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
            <button class="btn-main" type="submit">Salva</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
