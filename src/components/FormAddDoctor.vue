<script setup>
import api from "../services/api";
import { ref, defineEmits } from "vue";
import { useConfigStore } from "../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../router/index.js";

const props = defineProps({
  refresh: Boolean,
});

const emit = defineEmits(["setDoctorSelect"]);

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

          if (props.refresh) {
            setTimeout(() => {
              router.push({ name: "indexDoctors" });
            }, 1500);
          } else {
            emit("setDoctorSelect", resp.data.doctor);
          }
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 1500,
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
  <form @submit.prevent="handleSubmit">
    <div class="row gy-4">
      <div class="col-4">
        <label class="form-label">Nome</label>
        <input
          type="text"
          class="form-control"
          placeholder="Nome"
          name="name"
          id="name"
          v-model="form.name"
        />
      </div>
      <div class="col-4">
        <label class="form-label">Cognome</label>
        <input
          type="text"
          class="form-control"
          placeholder="Cognome"
          name="surname"
          id="surname"
          v-model="form.surname"
        />
      </div>
      <div class="col-4">
        <label class="form-label">Specializzazione</label>
        <input
          type="text"
          class="form-control"
          placeholder="Specializzazione"
          name="specialty"
          id="specialty"
          v-model="form.specialty"
        />
      </div>
      <div class="col-12">
        <button :class="props.refresh ? 'btn-main' : 'btn-white'" type="submit">
          Salva
        </button>
      </div>
    </div>
  </form>
</template>
<style lang=""></style>
